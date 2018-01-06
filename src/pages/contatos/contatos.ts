import { Component } from '@angular/core';

import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AuthService } from '../../shared/services/auth.service';

@IonicPage()
@Component({
  selector: 'page-contatos',
  templateUrl: 'contatos.html'
})
export class ContatosPage {

    constructor(private navCtrl: NavController,
              private toast: ToastController,
              private auth: AuthService) {}

    ionViewCanEnter() {
        // this.auth.isAutenticado().subscribe(usuario => {
        //     if (usuario) {
        //         return true;
        //     } else {
        //         this.navCtrl.setRoot('LoginPage');
        //         return false;
        //     }
        // });

        // this.auth.isAutenticado().toPromise()
        //     .then(usuario => {
        //         if (usuario) {
        //             return true
        //         } else {
        //             this.navCtrl.setRoot('LoginPage');
        //             return false
        //         }
        //     })

        if (this.auth.isAutenticado()) {
            return true;
        } else {
            this.navCtrl.setRoot('LoginPage');
            return false;
        }
    }

    apagarContato(resposta: {success: Boolean, message: string, error: string})  {
        if (resposta.success) {
            this.toast.create({
                message: resposta.message,
                cssClass: 'toast-success',
                duration: 3000
            }).present();
        } else {
            if (resposta.error === 'apagar-contato/contato-nao-encontrado') {
                this.toast.create({
                    message: 'Contato não foi encontrado.',
                    cssClass: 'toast-error',
                    duration: 3000
                }).present();
            } else if (resposta.error === 'apagar-contato/nao-autenticado') {
                this.toast.create({
                    message: 'Usuário não autenticado.',
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

    adicionarContato(resposta: {success: Boolean, message: string, error: string})  {
        if (resposta.success) {
            this.toast.create({
                message: resposta.message,
                cssClass: 'toast-success',
                duration: 3000
            }).present();
        } else {
            if (resposta.error === 'salvar-contato/contato-ja-adicionado') {
                this.toast.create({
                    message: 'Contato já foi adicionado.',
                    cssClass: 'toast-error',
                    duration: 3000
                }).present();
            } else if (resposta.error === 'salvar-contato/nao-autenticado') {
                this.toast.create({
                    message: 'Usuário não autenticado.',
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