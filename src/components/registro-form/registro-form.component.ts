import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Conta } from '../../shared/models/conta.interface';

import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-registro-form',
  templateUrl: './registro-form.component.html'
})
export class RegistroFormComponent implements OnInit {

  @Output() registroStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
  conta = {} as Conta;
  
  constructor(private authService: AuthService,
              private navCtrl: NavController) { 
    this.registroStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
  }

  ngOnInit() {
    this.authService.registroMessage.subscribe(
      (resposta) => {
        this.registroStatus.emit(resposta);
      }
    );
  }

  registrar() {
    const email = this.conta.email;
    //const senha = this.conta.senha;
    const nome = this.conta.nome;
    this.authService.registrar(email, nome);
    //this.usuarioService.registrarUsuario(email, senha, nome);
  }

  navigateToLoginPage() {
    this.navCtrl.setRoot('LoginPage');
  }

}
