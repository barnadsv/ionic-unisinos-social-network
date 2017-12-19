// import * as firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    autenticado = false;

    constructor() {}

    autenticar() {
        this.autenticado = true;
        localStorage.setItem('autenticado', 'true');
    }

    logout() {
        this.autenticado = false;
        localStorage.removeItem('autenticado');
    }

    isAutenticado() {
        if (this.autenticado === false) {
            this.autenticado = localStorage.getItem('autenticado') === null ? false : true;
        }
        return this.autenticado;
    }

    apagarAutenticacao() {
        this.autenticado = false;
        localStorage.removeItem('autenticado');
    }
}