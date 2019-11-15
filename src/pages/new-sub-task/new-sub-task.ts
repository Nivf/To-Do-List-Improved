import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { ITask } from '../tasks/tasks';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-new-sub-task',
  templateUrl: 'new-sub-task.html',
})
export class NewSubTaskPage {
  user_Name: string;
  password: string;
  return_label: string;
  task_description: string;
  task_title: string;
  SubTask: ITask;
  fatherTitle: string;
  
    constructor(public navCtrl: NavController, public http: Http,public storage: Storage
      ,public events: Events,public navParams: NavParams, public loadingController: LoadingController) 
      {
        this.fatherTitle = navParams.data.fatherTitle;
      }
    
    onSubmit(myForm){
      /*Async Function*/
      this.storage.get("userName").then((userNameD) => {
        this.user_Name = userNameD;
        this.SubTask = {
        title : this.task_title,
        description : this.task_description,
        status : "0",
        isChild: true
      }
      let loading = this.loadingController.create({
        content: 'Please wait...'
      });
      loading.present();

        this.http.post('http://localhost:5001/api/tasks/addSubTask'
        ,{"email": this.user_Name,"SubTask":this.SubTask, "fatherTitle" : this.fatherTitle})
        .subscribe(res => {
          if(res.json() != null){
                loading.dismiss();
                this.navCtrl.pop();
                this.events.publish('return-from-add-subTask-screen', res.json().tasks, this.fatherTitle);
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
