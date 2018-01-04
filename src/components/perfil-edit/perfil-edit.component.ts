import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { NavController } from 'ionic-angular';

import { UsuarioService } from '../../shared/services/usuario.service';

import { Usuario } from '../../shared/models/usuario.interface';

@Component({
  selector: 'app-perfil-edit',
  templateUrl: './perfil-edit.component.html'
})
export class PerfilEditComponent implements OnInit {

    @Output() salvarUsuarioStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
    id: string;
    usuario = {} as Usuario;

    constructor(private usuarioService: UsuarioService,
                private navCtrl: NavController) { 
        this.salvarUsuarioStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
    }

    ngOnInit() {
        this.usuario = this.usuarioService.getUsuarioAutenticado();
        
        this.usuarioService.salvarUsuarioMessage.subscribe(
            (resposta) => {
                this.salvarUsuarioStatus.emit(resposta);
            }
        );
    }

    onSubmit() {
        this.usuarioService.salvarUsuario(this.usuario, this.usuario.email);
        this.navigateAway();
    }

    onCancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.navCtrl.setRoot('FeedsPage');
    }

}
