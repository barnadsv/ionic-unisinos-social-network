import { Component } from '@angular/core';

import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@IonicPage()
@Component({
  selector: 'contatos-home',
  templateUrl: 'contatos.html'
})
export class ContatosPage {

    constructor(private navCtrl: NavController,
              private toast: ToastController) {}

    apagarContato(resposta: {success: Boolean, message: string, error: string})  {
        if (resposta.success) {
            this.toast.create({
                message: resposta.message,
                duration: 3000
            }).present();
        } else {
            if (resposta.error === 'apagar-contato/contato-nao-encontrado') {
                this.toast.create({
                    message: 'Contato não foi encontrado.',
                    duration: 3000
                }).present();
            } else if (resposta.error === 'apagar-contato/nao-autenticado') {
                this.toast.create({
                    message: 'Usuário não autenticado.',
                    duration: 3000
                }).present();
                this.navCtrl.setRoot('LoginPage');
            } else {
                this.toast.create({
                    message: resposta.message,
                    duration: 3000
                }).present();
            }
        }
    }

    adicionarContato(resposta: {success: Boolean, message: string, error: string})  {
        if (resposta.success) {
            this.toast.create({
                message: resposta.message,
                duration: 3000
            }).present();
        } else {
            if (resposta.error === 'salvar-contato/contato-ja-adicionado') {
                this.toast.create({
                    message: 'Contato já foi adicionado.',
                    duration: 3000
                }).present();
            } else if (resposta.error === 'salvar-contato/nao-autenticado') {
                this.toast.create({
                    message: 'Usuário não autenticado.',
                    duration: 3000
                }).present();
                this.navCtrl.setRoot('LoginPage');
            } else {
                this.toast.create({
                    message: resposta.message,
                    duration: 3000
                }).present();
            }
        }
    }

}