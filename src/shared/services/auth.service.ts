// import * as firebase from 'firebase';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    autenticado = false;

    constructor() {}

    autenticar() {
        this.autenticado = true;
    }

    logout() {
        this.autenticado = false;
    }

    isAutenticado() {
        return this.autenticado;
    }
}