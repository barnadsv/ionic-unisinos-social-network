import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedEditPage } from './feed-edit';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FeedEditPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedEditPage),
    ComponentsModule
  ],
})
export class FeedEditPageModule {}