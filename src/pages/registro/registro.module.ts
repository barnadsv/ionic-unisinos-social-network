import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroPage } from './registro';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RegistroPage
  ],
  imports: [
    IonicPageModule.forChild(RegistroPage),
    ComponentsModule
  ],
})
export class RegistroPageModule {}
