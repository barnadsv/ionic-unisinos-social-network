import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { Subject } from 'rxjs/Subject';

import { UsuarioService } from './usuario.service';
// import { Usuario } from '../models/usuario.interface';

@Injectable()
export class AuthService {

    autenticado: boolean;
    loginMessage = new Subject<{success: boolean, message: string, error: any}>();
    registroMessage = new Subject<{success: boolean, message: string, error: any}>();


    constructor(private afAuth: AngularFireAuth,
                private usuarioService: UsuarioService) {

        this.afAuth.authState.subscribe(usuario => {
            if (usuario) {
                this.autenticado = true;
                console.log('Autenticou');
            } else {
                this.autenticado = false;
                console.log('Saiu');
            }
        })
    }

    // autenticar() {
    //     //this.autenticado = true;
    //     localStorage.setItem('autenticado', 'true');
    // }

    

    isAutenticado() {
        // return this.afAuth.authState;

        // this.afAuth.authState.subscribe(usuario => {
        //     if (usuario) {
        //         return true
        //     } else {
        //         return false
        //     }
        // })

        // if (this.autenticado === false) {
        //     this.autenticado = localStorage.getItem('autenticado') === null ? false : true;
        // }
        return this.autenticado;
    }

    // apagarAutenticacao() {
    //     this.autenticado = false;
    //     localStorage.removeItem('autenticado');
    // }

    registrar(email: string, nome: string) {
        let randomPassword = this.getRandomString();
        this.afAuth.auth.createUserWithEmailAndPassword(email, randomPassword)
            .then(
                () => {
                    this.usuarioService.criarUsuario(email, nome)
                        .then(ref => {
                            //this.usuarioService.carregaUsuario();
                            this.afAuth.auth.sendPasswordResetEmail(email)
                                .then(
                                    () => {
                                        this.registroMessage.next({success: true, message: 'Usuário registrado com sucesso. Por favor, verifique seu e-mail para definir sua senha.', error: null})
                                        this.usuarioService.carregarUsuarioAutenticado();
                                    }
                                )
                                .catch(
                                    error => this.registroMessage.next({success: false, message: null, error: error.code})
                                )
                        })
                        .catch(
                            error => console.log(error)
                        )
                }
            )
            .catch(
                error => this.registroMessage.next({success: false, message: null, error: error.message})
            )
    }

    logar(email: string, password: string) {
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(
                response => {
                    this.afAuth.auth.currentUser.getIdToken()
                        .then(
                            (token: string) => {
                                this.loginMessage.next({success: true, message: "Login realizado com sucesso.", error: null});
                                this.usuarioService.carregarUsuarioAutenticado();
                            }
                        )
                }
            )
            .catch(
                error => this.loginMessage.next({success: false, message: null, error: error.code})
            );
    }

    sair() {
        this.afAuth.auth.signOut();
    }

    getRandomString() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 6;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
    }
}