import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import { Conta } from '../../shared/models/conta.interface';

import { UsuarioService } from '../../shared/services/usuario.service';

@Component({
  selector: 'app-registro-form',
  templateUrl: './registro-form.component.html'
})
export class RegistroFormComponent implements OnInit {

  @Output() registroStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
  conta = {} as Conta;
  
  constructor(private usuarioService: UsuarioService,
              private navCtrl: NavController,
              private toast: ToastController) { 
    this.registroStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
  }

  ngOnInit() {
    this.usuarioService.registroMessage.subscribe(
      (resposta) => {
        this.registroStatus.emit(resposta);
      }
    );
    // this.usuarioService.registroMessage.subscribe(
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
    //       if (resposta.error === 'auth/email-ja-cadastrado') {
    //         //this.toastr.error('Usuário com este e-mail já está cadastrado.');
    //         this.toast.create({
    //           message: 'Usuário com este e-mail já está cadastrado.',
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

  registrar() {
    const email = this.conta.email;
    const senha = this.conta.senha;
    const nome = this.conta.nome;
    this.usuarioService.registrarUsuario(email, senha, nome);
  }

}
