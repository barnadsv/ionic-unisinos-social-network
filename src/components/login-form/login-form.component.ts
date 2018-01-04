import { Component, Output, OnInit, EventEmitter } from '@angular/core';

import { Conta } from '../../shared/models/conta.interface';

import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent implements OnInit {

    @Output() loginStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
    conta = {} as Conta;

    constructor(private authService: AuthService,
                private navCtrl: NavController) { 
        this.loginStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
    }

    ngOnInit() {
        this.authService.loginMessage.subscribe(
            (resposta) => {
                this.loginStatus.emit(resposta);
            }
        );
    }

    login() {
        const email = this.conta.email;
        const senha = this.conta.senha;
        this.authService.logar(email, senha);
        //this.usuarioService.logarUsuario(email, senha);
    }

    navigateToRegistroPage() {
        this.navCtrl.setRoot('RegistroPage');
    }
}

