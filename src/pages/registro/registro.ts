import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toast: ToastController) {
  }

  registrar(resposta: {success: Boolean, message: string, error: string}) {
    if (resposta.success) {
      this.toast.create({
        message: resposta.message,
        duration: 3000
      }).present();
      // this.navCtrl.push('FeedsPage');
      this.navCtrl.setRoot('HomePage');
    } else {
      if (resposta.error === 'auth/email-ja-cadastrado') {
        this.toast.create({
          message: 'Usuário com este e-mail já está cadastrado.',
          duration: 3000
        }).present();
      } else {
        this.toast.create({
          message: resposta.message,
          duration: 3000
        }).present();
      }
    }
  }

}
