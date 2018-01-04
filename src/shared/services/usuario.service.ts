import { Injectable } from '@angular/core';

// import { sha256 } from 'js-sha256';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { Subject } from 'rxjs/Subject';

// import { AuthService } from './auth.service';

import { Usuario } from '../models/usuario.interface';
import { AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuarioService {

    private usuariosRef = this.db.list<Usuario>('usuarios');
    private usuarios: Observable<Usuario[]>;

    private usuarioRef: AngularFireObject<any>;
    private usuarioAutenticado: Usuario;

    //private usuarios: Usuario[] = [];
    // private usuarioAutenticado: Usuario;
    // loginMessage = new Subject<{success: boolean, message: string, error: any}>();
    // registroMessage = new Subject<{success: boolean, message: string, error: any}>();
    carregarUsuariosMessage = new Subject<{success: boolean, message: string, error: any}>();
    salvarUsuarioMessage = new Subject<{success: boolean, message: string, error: any}>();
    usuariosAlterados = new Subject<Usuario[]>();
    usuarioAutenticadoAlterado = new Subject<Usuario>();

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        afAuth.authState.subscribe(usuario => {
            if (usuario) {
                this.usuarios = this.usuariosRef
                    .snapshotChanges()
                    .map(changes => {
                        return changes.map(c => ({
                            key: c.payload.key, ...c.payload.val()
                        }))
                    });
                this.usuarioAutenticado = usuario;
            } else {
                this.usuarios = null;
                this.usuarioAutenticado = null;
            }
        })
    }

    public getUsuarios() {
        return this.usuarios;
    }

    salvarUsuario(usuarioASalvar: Usuario, key: string) {
        this.afAuth.authState.subscribe(usuario => {
            if (usuario) {
                if (key) {
                    this.usuariosRef.update(key, usuarioASalvar)
                        .then(ref => {
                            //this.usuariosAlterados.next(this.usuarios.slice());
                            this.salvarUsuarioMessage.next({success: true, message: 'Usuário salvo com sucesso.', error: null});
                        })
                        .catch(error => {
                            this.salvarUsuarioMessage.next({success: false, message: null, error: error});
                        })
                } else {
                    this.usuariosRef.push(usuarioASalvar)
                        .then(ref => {
                            //this.usuariosAlterados.next(this.usuarios.slice());
                            this.salvarUsuarioMessage.next({success: true, message: 'Usuário salvo com sucesso.', error: null});
                        })
                }
            } else {
                this.salvarUsuarioMessage.next({success: false, message: null, error: 'salvar-usuario/nao-autenticado'});
            }
        })
        // if (this.authService.isAutenticado()) {
        //     const indice = this.usuarios.findIndex(usuario => usuario.email === usuarioASalvar.email);
        //     if (indice > -1) {
        //         this.usuarios[indice] = usuarioASalvar;
        //         localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        //         this.usuariosAlterados.next(this.usuarios.slice());
        //         this.salvarUsuarioMessage.next({success: true, message: 'Usuário salvo com sucesso.', error: null});
        //         if (this.usuarioAutenticado.email === usuarioASalvar.email) {
        //             this.setUsuarioAutenticado(usuarioASalvar);
        //         }
        //     } else {
        //         this.salvarUsuarioMessage.next({success: false, message: null, error: 'salvar-usuario/usuario-nao-encontrado'});
        //     }
        // } else {
        //     this.salvarUsuarioMessage.next({success: false, message: null, error: 'salvar-usuario/nao-autenticado'});
        // }
    }

    // constructor(private authService: AuthService) {
    //     // this.usuarios = JSON.parse(localStorage.getItem('usuarios'));
    //     // if (this.usuarios === null) {
    //     //     this.usuarios = [];
    //     // }

    //     let self = this;
    //     firebase.database().ref('/usuarios').once('value')
    //     .then(
    //         (snapshot) => {
    //             self.usuarios = snapshot.val()
    //             if (self.usuarios === null) {
    //                 self.usuarios = [];
    //             }
    //         }
    //     )
    // }

    criarUsuario(email: string, nome: string) {
        let encodedEmail = this.encodeEmail(email);
        return this.usuariosRef.set(encodedEmail, { email: email, nome: nome });

        /*  // Quem chamar esta funcao, ira cuidar da navegacao apos o registro...
        this.usuarioService.registrarUsuario(email, senha, nome).then(ref => {
            this.navCtrl.setRoot('FeedsPage', { key: ref.key });
        }) 
        */
    }

    // _registrarUsuario(email: string, senha: string, nome: string) {
    //     const usuarioJaCadastrado = this.usuarios.find(usuario => usuario.email === email);
    //     if (typeof usuarioJaCadastrado === 'undefined') {
    //         const novoUsuario = {} as Usuario;
    //         novoUsuario.email = email;
    //         novoUsuario.senha = sha256(senha);
    //         novoUsuario.nome = nome;
    //         novoUsuario.contatos = [];
    //         this.usuarios.push(novoUsuario);
    //         localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    //         this.usuarioAutenticado = novoUsuario;
    //         this.authService.autenticar();
    //         localStorage.setItem('usuarioAutenticado', JSON.stringify(this.usuarioAutenticado));
    //         this.usuarioAutenticadoAlterado.next(this.usuarioAutenticado);
    //         this.usuariosAlterados.next(this.usuarios.slice());
    //         this.registroMessage.next({success: true, message: 'Usuário registrado com sucesso.', error: null});
    //     } else {
    //         this.registroMessage.next({success: false, message: null, error: 'auth/email-ja-cadastrado'});
    //     }
    // }

    // logarUsuario(email: string, senha: string) {
    //     const usuarioEncontrado = this.usuarios.find(usuario => usuario.email === email);
    //     if (typeof usuarioEncontrado !== 'undefined' && usuarioEncontrado.senha === sha256(senha)) {
    //         this.usuarioAutenticado = usuarioEncontrado;
    //         this.authService.autenticar();
    //         localStorage.setItem('usuarioAutenticado', JSON.stringify(this.usuarioAutenticado));
    //         this.usuarioAutenticadoAlterado.next(this.usuarioAutenticado);
    //         this.loginMessage.next({success: true, message: 'Login realizado com sucesso.', error: null});
    //     } else {
    //         this.loginMessage.next({success: false, message: null, error: 'auth/email-senha-errados'});
    //     }
    // }

    

    apagarUsuarios() {
        this.afAuth.authState.subscribe(usuario => {
            if (usuario) {
                this.usuariosRef.remove()
            }
        })
        // if (this.afAuth.authState)
        // if (this.authService.isAutenticado()) {
        //     localStorage.removeItem('usuarios');
        //     this.usuarios = [];
        // }
    }

    // apagarUsuarioAutenticado() {
    //     this.usuarioAutenticado = null;
    //     localStorage.removeItem('usuarioAutenticado');
    // }

    // logout() {
    //     this.usuarioAutenticado = null;
    //     this.usuarioAutenticadoAlterado.next(null);
    //     this.authService.logout();
    //     localStorage.removeItem('usuarioAutenticado');
    // }

    getUsuarioAutenticado(): Usuario {
        //this.usuarioAutenticado = localStorage.getItem('usuarioAutenticado') === null ? null : JSON.parse(localStorage.getItem('usuarioAutenticado'));
        return this.usuarioAutenticado;
    }

    // setUsuarioAutenticado(usuario: Usuario) {
    //     this.usuarioAutenticado = usuario;
    //     localStorage.setItem('usuarioAutenticado', JSON.stringify(usuario));
    // }

    carregaUsuario() {
        // var self = this;
        let encodedEmail = this.encodeEmail(this.afAuth.auth.currentUser.email);
        this.usuarioRef = this.db.object('usuarios/' + encodedEmail);
        this.usuarioRef.valueChanges().subscribe(usuarioAutenticado => {
            this.usuarioAutenticado = usuarioAutenticado;
            this.usuarioAutenticadoAlterado.next(usuarioAutenticado);
        })

    }

    encodeEmail(userEmail: string) {
        return userEmail.split(".").join(",");
    }

    decodeEmail(userEmail: string) {
        return userEmail.split(",").join(".");
    }

}
