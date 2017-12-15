import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Contato } from '../../../shared/models/contato.model';
import { Usuario } from '../../../shared/models/usuario.model';

import { UsuarioService } from '../../../shared/services/usuario.service';

@Injectable()
export class ContatoSearchService implements OnDestroy {

    usuarios: Usuario[];
    usuarioSubscription: Subscription;
    contatosEncontradosSubject = new Subject<Contato[]>();
    termoBusca = '';

    constructor(private usuarioService: UsuarioService) {
        this.usuarios = this.usuarioService.getUsuarios();
        this.usuarioSubscription = this.usuarioService.usuariosAlterados.subscribe(
            (usuarios: Usuario[]) => {
                this.usuarios = usuarios;
            }
        );
  }

  ngOnDestroy() {
      this.usuarioSubscription.unsubscribe();
  }

  search(term: string) {
    this.termoBusca = term;
    let contatos = [];
    if (term !== '') {
        const usuariosFiltrados = this.usuarios.filter( usuario => usuario.nome.toLowerCase().indexOf(term.toLowerCase()) > -1);
        contatos = <Contato[]>usuariosFiltrados.map(function(usuario) {
            return new Contato(usuario.email, usuario.nome);
        });
    }
    this.contatosEncontradosSubject.next(contatos);
  }
}
