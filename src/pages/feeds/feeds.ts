import { Component, ViewChild } from '@angular/core';

import { IonicPage } from 'ionic-angular';

import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AuthService } from '../../shared/services/auth.service';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Content } from 'ionic-angular/components/content/content';

@IonicPage()
@Component({
  selector: 'page-feeds',
  templateUrl: 'feeds.html'
})
export class FeedsPage {

    @ViewChild(Content) content: Content;
    
    constructor(private navCtrl: NavController,
                private auth: AuthService,
                private toast: ToastController) {
        
                }

    onNovoFeed() {
        this.navCtrl.push('FeedEditPage');
    }

    ionViewCanEnter() {
        this.auth.isAutenticado()
            .subscribe(usuario => {
                if (usuario) {
                    return true
                } else {
                    this.navCtrl.setRoot('LoginPage');
                    return false
                }
            })
        // if (this.auth.isAutenticado()) {
        //     return true;
        // } else {
        //     this.navCtrl.setRoot('LoginPage');
        //     return false;
        // }
    }

    feedsAlterados(flag: boolean) {
        this.scrollToTop();
    }

    scrollToTop() {
        this.content.scrollToTop();
    }

    apagarFeed(resposta: {success: Boolean, message: string, error: string}) {
        if (resposta.success) {
            this.toast.create({
                message: resposta.message,
                cssClass: 'toast-success',
                duration: 3000
            }).present();
            this.navCtrl.setRoot('FeedsPage');
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
    
}