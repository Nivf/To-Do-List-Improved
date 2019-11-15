import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { newTaskPage } from '../pages/newTask/newTask';
import { TasksPage } from '../pages/tasks/tasks';
import { EditTaskPage } from '../pages/edit-task/edit-task';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { IonicStorageModule } from '@ionic/storage';
import { NewSubTaskPage } from '../pages/new-sub-task/new-sub-task';
import {NgxPaginationModule} from 'ngx-pagination';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { Http, HttpModule , Response, RequestOptions, Headers } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    newTaskPage,
    NewSubTaskPage,
    EditTaskPage,
    TasksPage,
    TabsControllerPage
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot() ,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    newTaskPage,
    NewSubTaskPage,
    EditTaskPage,
    TasksPage,
    TabsControllerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
   
  ]
})
export class AppModule {}