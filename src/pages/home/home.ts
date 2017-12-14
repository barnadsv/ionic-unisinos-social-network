import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../shared/services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              private auth: AuthService) {

  }
  
  ionViewCanEnter() {
    if (this.auth.isAutenticado()) {
      return true;
    }
    this.navCtrl.setRoot('LoginPage');
    return false;
  }

}
