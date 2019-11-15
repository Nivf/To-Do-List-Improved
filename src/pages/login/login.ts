import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { TasksPage } from '../tasks/tasks';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  userName;
  pass;
  err_label;
  constructor(public navCtrl: NavController, public http: Http, public loadingCtrl: LoadingController) {
  }

  onSubmit(myForm){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    //Also a possibelity is to take the user name and password from the object Data.
    this.http.post('https://myserverniv.herokuapp.com/api/users/login',{"email": this.userName, "password": this.pass}).subscribe(res => {
      loading.dismiss();
      if(res.json() != null)
            this.navCtrl.push(TasksPage, res.json());
      else {
            this.err_label = "Username OR Password is wrong";
            myForm.reset();
           }
    })
  }
}
