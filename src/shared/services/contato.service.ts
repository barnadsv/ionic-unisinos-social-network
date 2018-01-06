import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from './auth.service';
import { UsuarioService } from './usuario.service';

import { Usuario } from '../models/usuario.interface';
import { Contato } from '../models/contato.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContatoService {

    private contatos: Contato[];
    
    adicionarContatoMessage = new Subject<{success: boolean, message: string, error: any}>();
    apagarContatoMessage = new Subject<{success: boolean, message: string, error: any}>();
    contatosAlterados = new Subject<Contato[]>();
    usuarioAutenticado: Observable<Usuario>;
    subscription: Subscription;

    constructor(private authService: AuthService,
                private usuarioService: UsuarioService) {

        // this.usuarioService.usuarioAutenticadoRef.valueChanges().subscribe(usuario => {
        //     this.contatos = usuario.contatos;
        // });
        
        // if (typeof usuarioAutenticado !== 'undefined'){
        //     this.contatos = usuarioAutenticado.contatos;
        // } else {
        //     this.contatos = null;
        // }

        this.subscription = this.usuarioService.usuarioAutenticadoAlterado.subscribe(
            (usuario: Usuario) => {
                this.contatos = usuario !== null || typeof this.contatos === 'undefined' ? usuario.contatos : [];
            }
        );
        
        if (this.contatos === null || typeof this.contatos === 'undefined') {
            this.contatos = [];
        }
    }

    adicionarContato(novoContato: Contato) {
        // const self = this;
        // this.authService.isAutenticado().toPromise()
        //     .then(usuario => {
        //         if (usuario) {
        //             const indice = self.contatos.findIndex(contato => contato.email === novoContato.email);
        //             if (indice === -1) {
        //                 self.contatos.push(novoContato);
        //                 const usuario = this.usuarioService.getUsuarioAutenticado();
        //                 usuario.contatos = this.contatos;
        //                 let encodedEmail = this.usuarioService.encodeEmail(usuario.email);
        //                 this.usuarioService.salvarUsuario(usuario, encodedEmail);
        //                 this.contatosAlterados.next(this.contatos.slice());
        //                 this.adicionarContatoMessage.next({success: true, message: 'Contato adicionado com sucesso.', error: null});
        //             } else {
        //                 this.adicionarContatoMessage.next({success: false, message: null, error: 'salvar-contato/contato-ja-adicionado'});
        //             }
        //         } else {
        //             this.adicionarContatoMessage.next({success: false, message: null, error: 'salvar-contato/nao-autenticado'});
        //         }
        //     })


        // const self = this;
        // this.authService.isAutenticado().subscribe(usuario => {
        //     if (usuario) {
        //         const indice = self.contatos.findIndex(contato => contato.email === novoContato.email);
        //         if (indice === -1) {
        //             self.contatos.push(novoContato);
        //             const usuario = this.usuarioService.getUsuarioAutenticado();
        //             usuario.contatos = this.contatos;
        //             let encodedEmail = this.usuarioService.encodeEmail(usuario.email);
        //             this.usuarioService.salvarUsuario(usuario, encodedEmail);
        //             this.contatosAlterados.next(this.contatos.slice());
        //             this.adicionarContatoMessage.next({success: true, message: 'Contato adicionado com sucesso.', error: null});
        //         } else {
        //             this.adicionarContatoMessage.next({success: false, message: null, error: 'salvar-contato/contato-ja-adicionado'});
        //         }
        //     } else {
        //         this.adicionarContatoMessage.next({success: false, message: null, error: 'salvar-contato/nao-autenticado'});
        //     }
        // });

        if (this.authService.isAutenticado()) {
            const indice = this.contatos.findIndex(contato => contato.email === novoContato.email);
            if (indice === -1) {
                this.contatos.push(novoContato);
                const usuario = this.usuarioService.getUsuarioAutenticado();
                usuario.contatos = this.contatos;
                let encodedEmail = this.usuarioService.encodeEmail(usuario.email);
                this.usuarioService.salvarUsuario(usuario, encodedEmail);
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
                    let encodedEmail = this.usuarioService.encodeEmail(usuario.email);
                    this.usuarioService.salvarUsuario(usuario, encodedEmail);
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
