import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewSubTaskPage } from './new-sub-task';

@NgModule({
  declarations: [
    NewSubTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(NewSubTaskPage),
  ],
})
export class NewSubTaskPageModule {}
