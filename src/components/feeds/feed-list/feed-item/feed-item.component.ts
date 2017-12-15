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
  dataCriacaoDif: string;
  dataCompartilhamentoDif: string;

  constructor(public usuarioService: UsuarioService,
              public feedService: FeedService,
              private navCtrl: NavController) {}

  ngOnInit() {
      this.usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();
      if (typeof this.feed !== 'undefined') {
          if (this.feed.dataCriacao != null && typeof this.feed.dataCriacao !== 'undefined') {
            this.dataCriacaoDif = this.calculateDataDif(this.feed.dataCriacao.toString());
          } else {
            this.dataCriacaoDif = "";
          }
          if (this.feed.dataCompartilhamento != null && typeof this.feed.dataCompartilhamento !== 'undefined') {
            this.dataCompartilhamentoDif = this.calculateDataDif(this.feed.dataCompartilhamento.toString());
          } else {
            this.dataCompartilhamentoDif = "";
          }
      } else {
        this.dataCriacaoDif = "";
        this.dataCompartilhamentoDif = "";
      }
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

  calculateDataDif(data: string) {
      let dataDif = "";
      const dataHoje = new Date().getTime();
      const dataCriacao = new Date(data).getTime();
      let seconds: number = Math.floor((dataHoje - dataCriacao)/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      let days = Math.floor(hours/24);
      let weeks = Math.floor(days/7);
      let months = Math.floor(days/30);
      let years = Math.floor(months/12);
      
      if (seconds > 0) {
        dataDif = seconds.toString() + ' segundos atrás';
      } else {
        dataDif = 'menos de 1 segundo atrás';
      }
      if (minutes > 0) {
        dataDif = minutes.toString() + ' minutos atrás';
      }
      if (hours > 0) {
        dataDif = hours.toString() + ' horas atrás';
      }
      if (days > 0) {
        dataDif = days.toString() + ' dias atrás';
      }
      if (weeks > 0) {
        dataDif = weeks.toString() + ' semanas atrás';
      }
      if (months > 0) {
        dataDif = months.toString() + ' meses atrás';
      }
      if (years > 0) {
        dataDif = years.toString() + ' anos atrás';
      }
      return dataDif;
  }

}
