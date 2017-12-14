import { Component, Output, OnInit, EventEmitter } from '@angular/core';

import { Conta } from '../../shared/models/conta.interface';

import { UsuarioService } from '../../shared/services/usuario.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent implements OnInit {

  @Output() loginStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
  conta = {} as Conta;

  constructor(private usuarioService: UsuarioService) { 
    this.loginStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
  }

  ngOnInit() {
    this.usuarioService.loginMessage.subscribe(
      (resposta) => {
        this.loginStatus.emit(resposta);
      }
  );
    // }
      // ngOnInit() {
      // this.usuarioService.loginMessage.subscribe(
      //   (resposta) => {
      //     // this.ngProgress.done();
      //     if (resposta.success) {
      //       //this.toastr.success(resposta.message);
      //       this.toast.create({
      //         message: resposta.message,
      //         duration: 3000
      //       }).present();
      //       //this.router.navigate(['/feeds']);
      //       this.navCtrl.push('FeedsPage');
      //     } else {
      //       //this.loggingService.logInfo(resposta.error);
      //       if (resposta.error === 'auth/email-senha-errados') {
      //         //this.toastr.error('Email/Senha errados.');
      //         this.toast.create({
      //           message: 'Email/Senha errados.',
      //           duration: 3000
      //         }).present();
      //       } else {
      //         //this.toastr.error(resposta.message);
      //         this.toast.create({
      //           message: resposta.message,
      //           duration: 3000
      //         }).present();
      //       }
      //     }
      //   }
      // );
      }

  login() {
    const email = this.conta.email;
    const senha = this.conta.senha;
    this.usuarioService.logarUsuario(email, senha);
  }

  navigateToRegistroPage() {
    // this.navCtrl.push('RegisterPage');
  }
}

