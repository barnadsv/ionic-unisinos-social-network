import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from './auth.service';
import { UsuarioService } from './usuario.service';

import { Usuario } from '../models/usuario.model';
import { Contato } from '../models/contato.model';

@Injectable()
export class ContatoService {

    private contatos: Contato[];
    adicionarContatoMessage = new Subject<{success: boolean, message: string, error: any}>();
    apagarContatoMessage = new Subject<{success: boolean, message: string, error: any}>();
    contatosAlterados = new Subject<Contato[]>();
    subscription: Subscription;

    constructor(private authService: AuthService,
                private usuarioService: UsuarioService) {
        if (typeof this.usuarioService.getUsuarioAutenticado() !== 'undefined'){
            this.contatos = this.usuarioService.getUsuarioAutenticado().contatos;
        } else {
            this.contatos = null;
        }
        // this.contatos = typeof this.usuarioService.getUsuarioAutenticado() !== 'undefined'? this.usuarioService.getUsuarioAutenticado().contatos : [];
        this.subscription = this.usuarioService.usuarioAutenticadoAlterado.subscribe(
            (usuario: Usuario) => {
                this.contatos = usuario !== null ? usuario.contatos : [];
            }
        );
        if (this.contatos === null) {
            this.contatos = [];
        }
    }

    adicionarContato(novoContato: Contato) {
        if (this.authService.isAutenticado()) {
            const indice = this.contatos.findIndex(contato => contato.email === novoContato.email);
            if (indice === -1) {
                this.contatos.push(novoContato);
                const usuario = this.usuarioService.getUsuarioAutenticado();
                usuario.contatos = this.contatos;
                this.usuarioService.salvarUsuario(usuario);
                this.contatosAlterados.next(this.contatos.slice());
                this.adicionarContatoMessage.next({success: true, message: 'Contato adicionado com sucesso.', error: null});
            } else {
                this.adicionarContatoMessage.next({success: false, message: null, error: 'salvar-contato/contato-ja-adicionado'});
            }
        } else {
            this.adicionarContatoMessage.next({success: false, message: null, error: 'salvar-contato/nao-autenticado'});
        }
    }

    apagarContato(email: string) {
        if (this.authService.isAutenticado()) {
            if (email !== null && email !== '') {
                const indice = this.contatos.findIndex(contato => contato.email === email);
                if (indice !== -1) {
                    this.contatos.splice(indice, 1);
                    const usuario = this.usuarioService.getUsuarioAutenticado();
                    usuario.contatos = this.contatos;
                    this.usuarioService.salvarUsuario(usuario);
                    this.contatosAlterados.next(this.contatos.slice());
                    this.apagarContatoMessage.next({success: true, message: 'Contato removido com sucesso.', error: null});
                } else {
                    this.apagarContatoMessage.next({success: false, message: null, error: 'apagar-contato/contato-nao-encontrado'});
                }
            }
        } else {
            this.apagarContatoMessage.next({success: false, message: null, error: 'apagar-contato/nao-autenticado'});
        }
    }

    getContatos() {
        return this.contatos.slice(); // slice faz uma nova cópia do array de contatos...
    }

}
