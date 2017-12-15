import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Contato } from '../../../shared/models/contato.interface';
import { ContatoService } from '../../../shared/services/contato.service';
import { ContatoSearchService } from '../contato-search/contato-search.service';

@Component({
  selector: 'app-contato-list',
  templateUrl: './contato-list.component.html'
})
export class ContatoListComponent implements OnInit, OnDestroy {

    @Output() apagarContatoStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
    subscription: Subscription;
    contatos: Contato[];


    constructor(private contatoService: ContatoService,
                private contatoSearchService: ContatoSearchService) { 
        this.apagarContatoStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
    }

    ngOnInit() {
        this.contatos = this.contatoService.getContatos();
        this.subscription = this.contatoService.contatosAlterados.subscribe(
            (contatos: Contato[]) => {
                this.contatos = contatos;
                this.contatoSearchService.search(this.contatoSearchService.termoBusca);
            }
        );

        this.contatoService.apagarContatoMessage.subscribe(
            (resposta) => {
              this.apagarContatoStatus.emit(resposta);
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // onNovoContato() {
    //     this.router.navigate(['new'], { relativeTo: this.route });
    // }

}
