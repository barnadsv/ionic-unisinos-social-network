import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilEditPage } from './perfil-edit';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PerfilEditPage
  ],
  imports: [
    IonicPageModule.forChild(PerfilEditPage),
    ComponentsModule
  ],
})
export class PerfilEditPageModule {}