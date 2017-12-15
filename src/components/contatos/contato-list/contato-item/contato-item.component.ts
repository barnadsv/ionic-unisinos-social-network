import { Component, Input } from '@angular/core';
import { Contato } from '../../../../shared/models/contato.model';
import { ContatoService } from '../../../../shared/services/contato.service';

@Component({
  selector: 'app-contato-item',
  templateUrl: './contato-item.component.html'
})
export class ContatoItemComponent {

  @Input() contato: Contato;

  constructor(private contatoService: ContatoService) {}

  onApagarContato(contato: Contato) {
    this.contatoService.apagarContato(contato.email);
  }

}
