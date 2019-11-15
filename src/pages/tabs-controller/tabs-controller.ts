import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TasksPage } from '../tasks/tasks';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  tab1Root: any = LoginPage;
  tab2Root: any = TasksPage;
  constructor(public navCtrl: NavController) {
  }
  goToTasks(params){
    if (!params) params = {};
    this.navCtrl.push(TasksPage);
  }
}
