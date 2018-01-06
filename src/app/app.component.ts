import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../shared/services/auth.service';
import { UsuarioService } from '../shared/services/usuario.service';
import { FeedService } from '../shared/services/feed.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: string;

    pages: Array<{title: string, component: string}>;

    constructor(private afAuth: AngularFireAuth,
                private db: AngularFireDatabase,
                public platform: Platform, 
                public statusBar: StatusBar, 
                public splashScreen: SplashScreen,
                private auth: AuthService,
                private usuarioService: UsuarioService,
                private feedService: FeedService,
                private alertCtrl: AlertController) {

        this.initializeApp();

        // Mudando a cor de fundo e a cor do texto do status bar
        this.statusBar.backgroundColorByHexString('#bcbdfc');
        this.statusBar.styleDefault();
        
        // used for an example of ngFor and navigation
        this.pages = [
            // { title: 'Login', component: 'LoginPage' },
            // { title: 'Registro', component: 'RegistroPage' },
            { title: 'Feeds', component: 'FeedsPage' },
            { title: 'Contatos', component: 'ContatosPage' },
            { title: 'Perfil', component: 'PerfilEditPage' },
            { title: 'Logout', component: 'LoginPage' },
            { title: 'Resetar Dados', component: 'LoginPage'}
        ];

        // this.auth.isAutenticado().subscribe(usuario => {
        //     if (usuario) {
        //         this.rootPage = 'LoginPage';
        //     } else {
        //         this.rootPage = 'FeedsPage';
        //     }
        // });

        this.afAuth.authState.subscribe(usuario => {
            if (usuario) {
                this.rootPage = 'FeedsPage';
            } else {
                this.rootPage = 'LoginPage';
            }
        });

        // if (!this.auth.isAutenticado()) {
        //     this.rootPage = 'LoginPage';
        // } else {
        //     this.rootPage = 'FeedsPage';
        // };

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
      if (page.title === 'Resetar Dados') {
        this.resetarDados();
      }
      this.nav.setRoot(page.component);
    }

    logout() {
      this.db.database.goOffline();
      this.auth.sair();
    }

    resetarDados() {
        let alert = this.alertCtrl.create({
            title: 'Confirmar remoção total dos dados',
            message: 'Esta é uma ação de suporte cuja intenção é remover todos os dados deste app do localStorage da WebView deste dispositivo. Você tem certeza que quer remover todos os dados deste app, ou seja, todos os usuários e feeds?',
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
                        this.feedService.apagarFeeds();
                        this.usuarioService.apagarUsuarios();
                        this.auth.sair();
                    }
                }
            ]
        });
        alert.present();
    }
}
