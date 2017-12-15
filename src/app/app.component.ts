import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../shared/services/auth.service';
import { UsuarioService } from '../shared/services/usuario.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string;

  pages: Array<{title: string, component: string}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              private auth: AuthService,
              private usuarioService: UsuarioService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Login', component: 'LoginPage' },
      { title: 'Registro', component: 'RegistroPage' },
      { title: 'Contatos', component: 'ContatosPage' },
      { title: 'Home', component: 'HomePage' },
      { title: 'List', component: 'ListPage' },
      { title: 'Logout', component: 'LoginPage' }
    ];

    if (!this.auth.isAutenticado()) {
        this.rootPage = 'LoginPage';
    } else {
        this.rootPage = 'HomePage';
    };

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title === 'Logout') {
      this.logout();
    }
    this.nav.setRoot(page.component);
  }

  logout() {
    this.usuarioService.logout();
  }
}
