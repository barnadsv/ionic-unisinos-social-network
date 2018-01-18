import { Injectable } from '@angular/core';

// import { sha256 } from 'js-sha256';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { Subject } from 'rxjs/Subject';

// import { AuthService } from './auth.service';

import { Usuario } from '../models/usuario.interface';
import { AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList } from 'angularfire2/database/interfaces';

@Injectable()
export class UsuarioService {

    public usuariosRef: AngularFireList<Usuario>;
    private usuarios: Observable<Usuario[]>;

    public usuarioAutenticadoRef: AngularFireObject<any>;
    private usuarioAutenticado: Usuario;

    carregarUsuariosMessage = new Subject<{success: boolean, message: string, error: any}>();
    salvarUsuarioMessage = new Subject<{success: boolean, message: string, error: any}>();
    usuariosAlterados = new Subject<Usuario[]>();
    usuarioAutenticadoAlterado = new Subject<Usuario>();

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        this.usuariosRef = this.db.list<Usuario>('usuarios');
        afAuth.authState.subscribe(usuario => {
            if (usuario) {
                this.usuarios = this.usuariosRef
                    .snapshotChanges()
                    .map(changes => {
                        return changes.map(c => ({
                            key: c.payload.key, ...c.payload.val()
                        }))
                    });

                let encodedEmail = this.encodeEmail(usuario.email);
                this.usuarioAutenticadoRef = this.db.object('usuarios/' + encodedEmail);
                this.usuarioAutenticadoRef.valueChanges().subscribe(usuarioAutenticado => {
                    this.usuarioAutenticado = usuarioAutenticado;
                    if (typeof this.usuarioAutenticado.contatos === 'undefined') {
                        this.usuarioAutenticado.contatos = [];
                    }
                    console.log('usuario autenticou: '+ JSON.stringify(this.usuarioAutenticado));
                    this.usuarioAutenticadoAlterado.next(this.usuarioAutenticado);
                })
                console.log('usuarios: '+ this.usuarios);
            } else {
                this.usuarios = null;
                this.usuarioAutenticado = null;
                console.log('usuario saiu: '+ this.usuarioAutenticado);
                console.log('usuarios: '+ this.usuarios);
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
                    const encodedKey = this.encodeEmail(key);
                    this.usuariosRef.update(encodedKey, usuarioASalvar)
                        .then(ref => {
                            this.salvarUsuarioMessage.next({success: true, message: 'Usuário salvo com sucesso.', error: null});
                        })
                        .catch(error => {
                            this.salvarUsuarioMessage.next({success: false, message: null, error: error});
                        })
                } else {
                    this.usuariosRef.push(usuarioASalvar)
                        .then(ref => {
                            this.salvarUsuarioMessage.next({success: true, message: 'Usuário salvo com sucesso.', error: null});
                        })
                }
            } else {
                this.salvarUsuarioMessage.next({success: false, message: null, error: 'salvar-usuario/nao-autenticado'});
            }
        })
    }

    criarUsuario(email: string, nome: string) {
        let encodedEmail = this.encodeEmail(email);
        let usuarioACriar = {} as Usuario;
        usuarioACriar.email = email;
        usuarioACriar.nome = nome;
        return this.usuariosRef.update(encodedEmail, usuarioACriar);
        //return this.usuariosRef.update(encodedEmail, { email: email, nome: nome });
    }

    apagarUsuarios() {
        if (this.usuarioAutenticadoAlterado !== null) {
            this.usuariosRef.remove()
        }
    }

    getUsuarioAutenticado(): Usuario {
        return this.usuarioAutenticado;
    }

    carregarUsuarioAutenticado() {
        let user = this.afAuth.auth.currentUser;
        if (user !== null) {
            let encodedEmail = this.encodeEmail(user.email);
            this.usuarioAutenticadoRef = this.db.object('usuarios/' + encodedEmail);
            this.usuarioAutenticadoRef.valueChanges().subscribe(usuarioAutenticado => {
                this.usuarioAutenticado = usuarioAutenticado;
                this.usuarioAutenticadoAlterado.next(usuarioAutenticado);
            })
        }
    }

    encodeEmail(userEmail: string) {
        return userEmail.split(".").join(",");
    }

    decodeEmail(userEmail: string) {
        return userEmail.split(",").join(".");
    }

}
