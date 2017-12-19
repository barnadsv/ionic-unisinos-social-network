import { Component } from '@angular/core';

import { IonicPage } from 'ionic-angular';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AuthService } from '../../shared/services/auth.service';

@IonicPage()
@Component({
  selector: 'page-feed-edit',
  templateUrl: 'feed-edit.html'
})
export class FeedEditPage {

    constructor(private toast: ToastController,
                private navCtrl: NavController,
                private auth: AuthService) {}

    salvarFeed(resposta: {success: Boolean, message: string, error: string}) {
        if (resposta.success) {
            this.toast.create({
                message: resposta.message,
                cssClass: 'toast-success',
                duration: 3000
            }).present();
            this.navCtrl.push('FeedsPage');
        } else {
            if (resposta.error === 'salvar-feed/nao-autenticado') {
                this.toast.create({
                    message: 'Usuário não está autenticado.',
                    cssClass: 'toast-error',
                    duration: 3000
                }).present();
                this.navCtrl.setRoot('LoginPage');
          } else {
                this.toast.create({
                    message: resposta.message,
                    cssClass: 'toast-error',
                    duration: 3000
                }).present();
            }
        }
    }

    ionViewCanEnter(): boolean{
        if (this.auth.isAutenticado()) {
            return true;
        } else {
            this.navCtrl.setRoot('LoginPage');
            return false;
        }
    }

}