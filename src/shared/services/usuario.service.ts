import { Injectable } from '@angular/core';

//import { NavController } from 'ionic-angular';

import { sha256 } from 'js-sha256';

import { Subject } from 'rxjs/Subject';

import { AuthService } from './auth.service';

import { Usuario } from '../models/usuario.interface';

@Injectable()
export class UsuarioService {

    private usuarios: Usuario[] = [];
    private usuarioAutenticado: Usuario;
    loginMessage = new Subject<{success: boolean, message: string, error: any}>();
    registroMessage = new Subject<{success: boolean, message: string, error: any}>();
    salvarUsuarioMessage = new Subject<{success: boolean, message: string, error: any}>();
    usuariosAlterados = new Subject<Usuario[]>();
    usuarioAutenticadoAlterado = new Subject<Usuario>();


    constructor(private authService: AuthService,
                /*private navCtrl: NavController*/) {
        this.usuarios = JSON.parse(localStorage.getItem('usuarios'));
        if (this.usuarios === null) {
            this.usuarios = [];
        }
    }

    registrarUsuario(email: string, senha: string, nome: string) {
        const usuarioJaCadastrado = this.usuarios.find(usuario => usuario.email === email);
        if (typeof usuarioJaCadastrado === 'undefined') {
            const novoUsuario = {} as Usuario;
            novoUsuario.email = email;
            novoUsuario.senha = sha256(senha);
            novoUsuario.nome = nome;
            novoUsuario.contatos = [];
            // const novoUsuario = new Usuario(email, sha256(senha), nome, []);
            this.usuarios.push(novoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
            this.usuarioAutenticado = novoUsuario;
            this.authService.autenticar();
            localStorage.setItem('usuarioAutenticado', JSON.stringify(this.usuarioAutenticado));
            this.usuarioAutenticadoAlterado.next(this.usuarioAutenticado);
            this.usuariosAlterados.next(this.usuarios.slice());
            this.registroMessage.next({success: true, message: 'Usuário registrado com sucesso.', error: null});
        } else {
            this.registroMessage.next({success: false, message: null, error: 'auth/email-ja-cadastrado'});
        }
    }

    logarUsuario(email: string, senha: string) {
        const usuarioEncontrado = this.usuarios.find(usuario => usuario.email === email);
        if (typeof usuarioEncontrado !== 'undefined' && usuarioEncontrado.senha === sha256(senha)) {
            this.usuarioAutenticado = usuarioEncontrado;
            this.authService.autenticar();
            localStorage.setItem('usuarioAutenticado', JSON.stringify(this.usuarioAutenticado));
            this.usuarioAutenticadoAlterado.next(this.usuarioAutenticado);
            this.loginMessage.next({success: true, message: 'Login realizado com sucesso.', error: null});
        } else {
            this.loginMessage.next({success: false, message: null, error: 'auth/email-senha-errados'});
        }
    }

    salvarUsuario(usuarioASalvar: Usuario) {
        if (this.authService.isAutenticado()) {
            const indice = this.usuarios.findIndex(usuario => usuario.email === usuarioASalvar.email);
            if (indice > -1) {
                this.usuarios[indice] = usuarioASalvar;
                localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
                this.usuariosAlterados.next(this.usuarios.slice());
                this.salvarUsuarioMessage.next({success: true, message: 'Usuário salvo com sucesso.', error: null});
            } else {
                this.salvarUsuarioMessage.next({success: false, message: null, error: 'salvar-usuario/usuario-nao-encontrado'});
            }
        } else {
            this.salvarUsuarioMessage.next({success: false, message: null, error: 'salvar-usuario/nao-autenticado'});
        }
    }

    apagarUsuarios() {
        if (this.authService.isAutenticado()) {
            localStorage.removeItem('usuarios');
            this.usuarios = [];
        }
    }

    logout() {
        this.usuarioAutenticado = null;
        this.usuarioAutenticadoAlterado.next(null);
        this.authService.logout();
        localStorage.removeItem('usuarioAutenticado');
        //this.navCtrl.setRoot('LoginPage');
    }

    getUsuarioAutenticado(): Usuario {
        this.usuarioAutenticado = localStorage.getItem('usuarioAutenticado') === null ? null : JSON.parse(localStorage.getItem('usuarioAutenticado'));
        return this.usuarioAutenticado;
    }

    getUsuarios(): Usuario[] {
        return this.usuarios;
    }

}
