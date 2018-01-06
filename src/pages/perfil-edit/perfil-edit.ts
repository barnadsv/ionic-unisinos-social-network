import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AuthService } from '../../shared/services/auth.service';

@IonicPage()
@Component({
  selector: 'page-perfil-edit',
  templateUrl: 'perfil-edit.html',
})
export class PerfilEditPage {

    constructor(private navCtrl: NavController,
                private toast: ToastController,
                private auth: AuthService) {}

    salvarUsuario(resposta: {success: Boolean, message: string, error: string}) {
        if (resposta.success) {
            this.toast.create({
                message: resposta.message,
                cssClass: 'toast-success',
                duration: 3000
            }).present();
            this.navCtrl.push('FeedsPage');
        } else {
            if (resposta.error === 'salvar-usuario/nao-autenticado') {
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
    
}
