import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../shared/services/auth.service';
import { UsuarioService } from '../shared/services/usuario.service';
import { ContatoService } from '../shared/services/contato.service';
import { ContatoSearchService } from '../components/contatos/contato-search/contato-search.service';
import { FeedService } from '../shared/services/feed.service';

const firebaseConfig = {
    apiKey: "AIzaSyCLl_Us5V5rR2WGXMwm9aFNYj3lo5JJAwM",
    authDomain: "unisinos-social-network.firebaseapp.com",
    databaseURL: "https://unisinos-social-network.firebaseio.com",
    projectId: "unisinos-social-network",
    storageBucket: "unisinos-social-network.appspot.com",
    messagingSenderId: "124601563009"
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    UsuarioService,
    ContatoService,
    ContatoSearchService,
    FeedService
  ]
})
export class AppModule {}
