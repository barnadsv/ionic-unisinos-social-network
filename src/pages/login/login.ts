import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    constructor(private navCtrl: NavController,
                private toast: ToastController) {}

    login(resposta: {success: Boolean, message: string, error: string}) {
        if (resposta.success) {
            this.toast.create({
                message: resposta.message,
                cssClass: 'toast-success',
                duration: 3000
            }).present();
            this.navCtrl.setRoot('FeedsPage');
        } else {
            if (resposta.error === 'auth/email-senha-errados') {
                this.toast.create({
                    message: 'Email/Senha errados.',
                    cssClass: 'toast-error',
                    duration: 3000
                }).present();
            } else {
                if (resposta.error === 'auth/user-not-found') {
                    this.toast.create({
                        message: 'E-mail/Senha não estão corretos.',
                        cssClass: 'toast-error',
                        duration: 3000
                    }).present();
                } else {
                    this.toast.create({
                        message: resposta.error,
                        cssClass: 'toast-error',
                        duration: 3000
                    }).present();
                }
            }
        }
    }
  
}
