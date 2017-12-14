import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Conta } from '../../shared/models/conta.interface';

import { UsuarioService } from '../../shared/services/usuario.service';

@Component({
  selector: 'app-registro-form',
  templateUrl: './registro-form.component.html'
})
export class RegistroFormComponent implements OnInit {

  @Output() registroStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
  conta = {} as Conta;
  
  constructor(private usuarioService: UsuarioService) { 
    this.registroStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
  }

  ngOnInit() {
    this.usuarioService.registroMessage.subscribe(
      (resposta) => {
        this.registroStatus.emit(resposta);
      }
    );
  }

  registrar() {
    const email = this.conta.email;
    const senha = this.conta.senha;
    const nome = this.conta.nome;
    this.usuarioService.registrarUsuario(email, senha, nome);
  }

}
