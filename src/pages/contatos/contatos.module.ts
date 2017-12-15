import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContatosPage } from './contatos';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ContatosPage,
  ],
  imports: [
    IonicPageModule.forChild(ContatosPage),
    ComponentsModule
  ],
})
export class ContatosPageModule {}