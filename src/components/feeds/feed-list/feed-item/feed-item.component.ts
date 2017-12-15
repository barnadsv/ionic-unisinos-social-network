import { Component, OnInit, Input } from '@angular/core';
import { Feed } from '../../../../shared/models/feed.interface';
import { Usuario } from '../../../../shared/models/usuario.interface';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { FeedService } from '../../../../shared/services/feed.service';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html'
})
export class FeedItemComponent implements OnInit {

  @Input() feed: Feed;
  usuarioAutenticado: Usuario;

  constructor(public usuarioService: UsuarioService,
              public feedService: FeedService,
              private navCtrl: NavController) {}

  ngOnInit() {
      this.usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();
  }

  onCompartilhar(feed: Feed) {
      const novoFeed  = { ...feed };
      novoFeed.usuarioCompartilhou = this.usuarioAutenticado;
      novoFeed.dataCompartilhamento = new Date();
      this.feedService.salvarFeed('', novoFeed, true);
  }

  navigateToFeedEdit(feedId: string) {
      this.navCtrl.push('FeedEditPage', { id: feedId });
  }

}
