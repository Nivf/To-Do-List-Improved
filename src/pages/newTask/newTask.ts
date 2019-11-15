import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { ITask } from '../tasks/tasks';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-newTask',
  templateUrl: 'newTask.html'
})
export class newTaskPage {
user_Name: string;
password: string;
return_label: string;
task_description: string;
task_title: string;
task: ITask;

  constructor(public navCtrl: NavController, public http: Http,public storage: Storage
    ,public events: Events, public loadingController: LoadingController) {
  }

  onSubmit(myForm){
    /*Async Function*/
    this.storage.get("userName").then((userNameD) => {
      this.user_Name = userNameD;
      var newTask = {
      title : this.task_title,
      description : this.task_description,
      status : "0",
      isFather: true,
      children: []
    }
    let loading = this.loadingController.create({
      content: 'Please wait...'
    });
    loading.present();
      this.http.post('http://localhost:5001/api/tasks/addTask',{"email": this.user_Name,"task":newTask}).subscribe(res => {
        if(res.json() != null){
              loading.dismiss();
              this.events.publish('return-from-addOrEdit-task-screen', res.json().tasks);
              this.navCtrl.pop();
        }
        else {
              this.return_label = "Oppppps something is not workin :(";
              myForm.reset();
             }
      })
    });
    
    //Need to use CUID instad of password...like AWZ...    
   
  }
}
