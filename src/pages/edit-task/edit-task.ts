import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { ITask } from '../tasks/tasks';
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})

export class EditTaskPage {
  task_description: string;
  task_title: string;
  tasks: ITask[];
  user_Name: string;
  return_label: string;
  currTaskIndex: string;
  currStatus: string;
  oldTitle: string;

  constructor(public navCtrl: NavController,navParams: NavParams
    , public http: Http,public storage: Storage,public events: Events, public loadingCtrl: LoadingController) {
    this.currTaskIndex =  navParams.data.index;
    this.task_title = navParams.data.tasks[this.currTaskIndex].title;
    this.task_description = navParams.data.tasks[this.currTaskIndex].description;
    this.currStatus = navParams.data.tasks[this.currTaskIndex].status;
    this.tasks = navParams.data.tasks;
  }
  onSubmit(myForm){
    /*Async Function*/
    this.storage.get("userName").then((userNameD) => {
      this.user_Name = userNameD;
      this.oldTitle = this.tasks[this.currTaskIndex].title;
      this.tasks[this.currTaskIndex] = {
      title : this.task_title,
      description : this.task_description, //add desrction field
      status : this.currStatus
    }
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    var me = this;
      this.http.post('http://localhost:5001/api/tasks/editTask',{"email": this.user_Name
      ,"tasks":this.tasks,"index": this.currTaskIndex,oldTitle: this.oldTitle}).subscribe(res => {
        if(res.json() != null){
              loading.dismiss();
              this.navCtrl.pop();
              this.events.publish('return-from-addOrEdit-task-screen', res.json().tasks, me.currTaskIndex);
        }
        else {
              this.return_label = "Oppppps something is not workin :(";
              myForm.reset();
             }
      })
    });
  }
}