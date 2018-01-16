import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Feed } from '../../../../shared/models/feed.interface';
import { Usuario } from '../../../../shared/models/usuario.interface';
import { UsuarioService } from '../../../../shared/services/usuario.service';
import { FeedService } from '../../../../shared/services/feed.service';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AngularFireAuth } from 'angularfire2/auth';
// import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html'
})
export class FeedItemComponent implements OnInit, OnDestroy {

    @Input() feed: Feed;
    //@Input() offset: number;

    private _offset: number = 0;
    get offset(): number {
        // transform value for display
        return this.offset;
    }
    @Input()
    set offset(offset: number) {
        //console.log('offset previous value: ', this._offset);
        //console.log('offset new value: ', offset);
        if (this._offset === 0) {
            this._offset = offset;
        } else {
            console.log('Manteve o offset: '+ this._offset);
        }
    }

    usuarioAutenticado: Usuario;
    dataCriacaoDif: string;
    dataCompartilhamentoDif: string;
    dataUltimaAlteracaoDif: string;
    temImagem: boolean;
    interval;

    constructor(private afAuth: AngularFireAuth,
                public usuarioService: UsuarioService,
                public feedService: FeedService,
                private navCtrl: NavController,
                private alertCtrl: AlertController) {}

    ngOnInit() {
        //this.usuarioAutenticado = this.usuarioService.getUsuarioAutenticado() === null ? {} as Usuario : this.usuarioService.getUsuarioAutenticado();
        if (this.usuarioAutenticado === null || typeof this.usuarioAutenticado === 'undefined') {
            this.usuarioAutenticado = {} as Usuario;
            let user = this.afAuth.auth.currentUser;
            this.usuarioAutenticado.email = user.email;
            this.usuarioAutenticado.nome = user.displayName;
        }
        
        this.interval = setInterval(() => {
            this.atualizaDataDifs();
        }, 1000);
        this.atualizaTemImagem();
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    atualizaDataDifs() {
        if (typeof this.feed !== 'undefined') {
            if (this.feed.dataCriacao != null && typeof this.feed.dataCriacao !== 'undefined') {
                this.dataCriacaoDif = this.calculateDataDif(this.feed.dataCriacao);
            } else {
                this.dataCriacaoDif = "";
            }
            if (this.feed.dataUltimaAtualizacao != null && typeof this.feed.dataUltimaAtualizacao !== 'undefined') {
                this.dataUltimaAlteracaoDif = this.calculateDataDif(this.feed.dataUltimaAtualizacao);
            } else {
                this.dataUltimaAlteracaoDif = "";
            }
            if (this.feed.dataCompartilhamento != null && typeof this.feed.dataCompartilhamento !== 'undefined') {
                this.dataCompartilhamentoDif = this.calculateDataDif(this.feed.dataCompartilhamento);
            } else {
                this.dataCompartilhamentoDif = "";
            }
        } else {
            this.dataCriacaoDif = "";
            this.dataCompartilhamentoDif = "";
        }
    }

    atualizaTemImagem() {
        if (typeof this.feed !== 'undefined') {
            if (typeof this.feed.imagem === 'undefined' || this.feed.imagem === '') {
                this.temImagem = false;
            } else {
                this.temImagem = true;
            }
        } else {
            this.temImagem = false;
        }
    }

    onCompartilhar(feed: Feed) {
        const novoFeed  = { ...feed };
        novoFeed.usuarioCompartilhou = this.usuarioAutenticado;
        //novoFeed.dataCompartilhamento = new Date();
        this.feedService.salvarFeed('', novoFeed, true);
    }

    navigateToFeedEdit(feed: Feed) {
        this.navCtrl.push('FeedEditPage', { feed: feed });
    }

    deleteFeed(feedId: string) {
        let alert = this.alertCtrl.create({
            title: 'Confirmar remoção',
            message: 'Você deseja realmente remover este feed?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Remover',
                    handler: () => {
                        this.feedService.apagarFeed(feedId);
                    }
                }
            ]
            });
        alert.present();  
    }

    calculateDataDif(data: any) {
        let dataDif = "";
        const offset = this._offset;
        // console.log(offset);
        const dataHojeDispositivo = new Date().getTime();
        // console.log(dataHojeDispositivo);
        const dataHoje = dataHojeDispositivo + offset;
        //const dataHoje = dataHojeDispositivo;
        // const dataHojeAjustada = dataHoje + offset;
        // console.log(dataHojeAjustada);
        //console.log(dataH);
        //const dataCriacao = new Date(data).getTime();
        //let seconds: number = Math.floor((dataHoje - dataCriacao)/1000);
        let seconds: number = Math.floor((dataHoje - data)/1000);
        let minutes = Math.floor(seconds/60);
        let hours = Math.floor(minutes/60);
        let days = Math.floor(hours/24);
        let weeks = Math.floor(days/7);
        let months = Math.floor(days/30);
        let years = Math.floor(months/12);
        
        if (seconds > 0) {
            seconds === 1 ? dataDif = 'há 1 segundo' : dataDif = 'há '+ seconds.toString() + ' segundos';
        } else {
            dataDif = 'há menos de 1 segundo';
        }
        if (minutes > 0) {
            // dataDif = minutes.toString() + ' minutos atrás';
            minutes === 1 ? dataDif = 'há 1 minuto' : dataDif = 'há '+ minutes.toString() + ' minutos';
        }
        if (hours > 0) {
            // dataDif = hours.toString() + ' horas atrás';
            hours === 1 ? dataDif = 'há 1 hora' : dataDif = 'há '+ hours.toString() + ' horas';
        }
        if (days > 0) {
            // dataDif = days.toString() + ' dias atrás';
            days === 1 ? dataDif = 'há 1 dia' : dataDif = 'há '+ days.toString() + ' dias';
        }
        if (weeks > 0) {
            // dataDif = weeks.toString() + ' semanas atrás';
            weeks === 1 ? dataDif = 'há 1 semana' : dataDif = 'há '+ weeks.toString() + ' semanas';
        }
        if (months > 0) {
            // dataDif = months.toString() + ' meses atrás';
            months === 1 ? dataDif = 'há 1 mês' : dataDif = 'há '+ months.toString() + ' meses';
        }
        if (years > 0) {
            // dataDif = years.toString() + ' anos atrás';
            years === 1 ? dataDif = 'há 1 ano' : dataDif = 'há '+ years.toString() + ' anos';
        }
        return dataDif;
    }

}
