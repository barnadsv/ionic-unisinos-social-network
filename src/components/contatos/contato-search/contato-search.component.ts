import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { ContatoSearchService } from './contato-search.service';

import { Contato } from '../../../shared/models/contato.interface';
import { ContatoService } from '../../../shared/services/contato.service';
import { UsuarioService } from '../../../shared/services/usuario.service';

@Component({
    selector: 'app-contato-search',
    templateUrl: './contato-search.component.html'
})
export class ContatoSearchComponent implements OnInit, OnDestroy {

    @Output() adicionarContatoStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
    termoDigitado = '';
    resultados: Contato[];
    contatos: Contato[];
    subscription: Subscription;
    termo: string;

    constructor(private contatoSearchService: ContatoSearchService,
                private contatoService: ContatoService,
                private usuarioService: UsuarioService) {
        this.adicionarContatoStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
    }

    ngOnInit() {

        this.contatoService.adicionarContatoMessage.subscribe(
            (resposta) => {
                if (resposta.success) {
                    this.termo = "";
                }
                this.adicionarContatoStatus.emit(resposta);
            }
        );

        this.contatoSearchService.contatosEncontradosSubject
            .subscribe(resultados => {
                const preResultados = resultados.filter(resultado => !this.contatos.find(contato => contato.email === resultado.email));

                this.resultados = preResultados.filter(resultado => resultado.email !== this.usuarioService.getUsuarioAutenticado().email);
                
                // this.resultados = resultados.filter(function(resultado) {
                //     return !this.contatos.find(function(contato) {
                //         return contato.email === resultado.email;
                //     });
                // });
            });

        this.contatos = this.contatoService.getContatos();
        this.subscription = this.contatoService.contatosAlterados.subscribe(
            (contatos: Contato[]) => {
                this.contatos = contatos;
                this.termoDigitado = '';
                this.searchTerm(this.termoDigitado);
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    searchTerm(value) {
        this.contatoSearchService.search(value);
    }

    onAdicionarContato(contato) {
        this.contatoService.adicionarContato(contato);
    }
}
