import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { newTaskPage } from '../newTask/newTask';
import { EditTaskPage } from '../edit-task/edit-task';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NewSubTaskPage } from '../new-sub-task/new-sub-task';


export interface ITask {
  title: string;
  description: string;
  status: string;
  children?: ITask[];
  isChild?: boolean;
  isFather?: boolean;
  fatherTitle?: string;
}

interface IHash {
  [indexer: string]: {
    iconName: string,
    iconColor: string
  };
}

interface IGroupHash {
  [indexer: string]: {
    show: boolean
  };
}
@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html'
})

export class TasksPage {
  tasks: ITask[];
  hierarchicalList: ITask[];
  task: ITask;
  userName: string;
  pass: string;
  taskStatus: string;
  satutsToIconHash: IHash[] = [];
  selectedItemTitle: string;
  isAscendingVar: boolean;
  lastChangedTaskIndex: number;
  isTree: boolean;
  originalTasksList: ITask[];
  expand: boolean;
  shownGroups: IGroupHash[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public http: Http, public storage: Storage, public events: Events
    , public alertCtrl: AlertController) {
    /*
     ---------------------------------
     |                                |
     |           Events               |
     |          Subsriber             |
     |                                |
     ---------------------------------
     */
    events.subscribe('return-from-addOrEdit-task-screen', (tasks: ITask[], index?: number) => {
      this.originalTasksList = tasks.map(a => ({ ...a }));
      for (let k = 0; k < tasks.length; k++) {
        var fatherTitle: string = tasks[k].title;
        this.shownGroups[fatherTitle] = { show: true };
      }
      this.tasks = this.flatTaskArray(tasks);
      // index = index != undefined? index : tasks.length - 1;
      !this.isAscendingVar ? this.sortByStringAscending() : this.sortByStringAscending();
      this.lastChangedTaskIndex = index;
    });

    events.subscribe('return-from-add-subTask-screen', (tasks: ITask[], fatherTitle: string) => {
      this.originalTasksList = tasks.map(a => ({ ...a }));
      for (let k = 0; k < tasks.length; k++) {
        var fatherTitle: string = tasks[k].title;
        this.shownGroups[fatherTitle] = { show: true };
      }
      this.tasks = this.flatTaskArray(tasks);
      !this.isAscendingVar ? this.sortByStringAscending() : this.sortByStringAscending();
      // this.lastChangedTaskIndex = newTaskIndex;
    });

    /*
 ---------------------------------
 |                                |
 |           Init                 |
 |                                |
 |                                |
 ---------------------------------
 */
    /*Hashmap default values to icon*/
    this.satutsToIconHash["0"] = { iconName: "close-circle", iconColor: "danger" };
    this.satutsToIconHash["1"] = { iconName: "clock", iconColor: "pending" };
    this.satutsToIconHash["2"] = { iconName: "checkmark-circle", iconColor: "secondary" };

    for (let k = 0; k < navParams.data[0].tasks.length; k++) {
      var fatherTitle: string = navParams.data[0].tasks[k].title;
      this.shownGroups[fatherTitle] = { show: true };
    }
    this.isTree = true;
    this.isAscendingVar = false;
    this.originalTasksList = navParams.data[0].tasks.map(a => ({ ...a }));
    this.sortByStringAscending(navParams.data[0].tasks);
    this.hierarchicalList = navParams.data[0].tasks;
    // this.tasks = this.flatTaskArray(navParams.data[0].tasks);

    this.userName = navParams.data[0].email;
    this.pass = navParams.data[0].password;


    /*User Credentials*/
    storage.set('userName', navParams.data[0].email);
    storage.set('pass', navParams.data[0].password);

  }

  /*
 ---------------------------------
 |                                |
 |           Server               |
 |            Req'                |
 |                                |
 ---------------------------------
 */
  /* SHOULD BE ON A SEPARATE SERVICE */
  delete(title: string) {
    this.http.post('http://localhost:5001/api/tasks/delete', { "email": this.userName, "title": title }).subscribe(res => {
      if (res.json() != null) {
        this.tasks = this.flatTaskArray(res.json().tasks);
      }
      else {
        //   this.err_label = "Username OR Password is wrong";
      }
    })
  }

  add(fatherTitle?: string) {
    if (fatherTitle == undefined)
      this.navCtrl.push(newTaskPage);
    else
      this.navCtrl.push(NewSubTaskPage, { fatherTitle: fatherTitle });
  }

  edit(i: string) {
    this.navCtrl.push(EditTaskPage, { tasks: this.tasks, index: i });
  }

  flatTaskArray(tasks: ITask[]) {
    let tempTaskArray = tasks;
    const taskLength = tempTaskArray.length;
    for (let i = 0, offsetToNextFather = 0; i < tempTaskArray.length; i++) {
      let children = tempTaskArray[i].children;
      if (children) {
        for (var j = 0; j < children.length; j++) {
          offsetToNextFather += j;
          children[j].fatherTitle = tempTaskArray[i].title;
          tempTaskArray.splice(i + j + 1, 0, children[j]);
        }
        (j > 0) && (offsetToNextFather += j);
      }
    }
    return tempTaskArray;
  }

  changeStatus(title: string) {
    this.http.post('http://localhost:5001/api/tasks/changeStatus'
      , { "email": this.userName, "title": title, "tasks": this.originalTasksList }).subscribe(res => {
        if (res.json() != null) {
          this.originalTasksList = res.json().tasks.map(a => ({ ...a }));
          this.tasks = this.flatTaskArray(res.json().tasks);
          !this.isAscendingVar ? this.sortByStringAscending() : this.sortByStringAscending();
        }
        else {
        }
      })
  }

  changeSubTaskStatus(childrenTitle: string) {
    this.http.post('http://localhost:5001/api/tasks/changeSubTaskStatus'
      , { "email": this.userName, "childrenTitle": childrenTitle, "tasks": this.tasks }).subscribe(res => {
        if (res.json() != null) {
          console.log(res.json().tasks);
          this.tasks = res.json().tasks;
        }
        else {
        }
      })
  }

  shouldShowRow(task: ITask) {
    return !(task.isChild == true && this.shownGroups[task.fatherTitle].show == true)
      && !(task.isChild != true && task.isFather == true)
  }

  selectedItem(title: string) {
    if (this.selectedItemTitle != title)
      this.selectedItemTitle = title;
    else
      /*Press on the same task twice -> minimize task*/
      this.selectedItemTitle = "";
  }

  removeActivateClass() {
    this.lastChangedTaskIndex = -1;
  }

  /*MORE ABOUT SORT - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort*/

  /*
   ---------------------------------
   |                                |
   |           String               |
   |       Sorting Function         |
   |                                |
   ---------------------------------
   */
  //Ascending- Function returns 1 if the second value is greater.
  sortByStringAscending(tasks?: ITask[]) {
    var myTask = (tasks || this.originalTasksList.map(a => ({ ...a })))
    myTask.sort(function (a, b) {
      var statusA, statusB;
      statusA = a.status;
      statusB = b.status;
      return statusA > statusB ? 1 : statusA < statusB ? -1 : 0;
    });
    this.tasks = this.flatTaskArray(myTask);
  }
  //Descending- Function returns 1 if the second value is greater.
  sortByStringDescending(tasks?: ITask[]) {
    var myTask = (tasks || this.originalTasksList.map(a => ({ ...a })))
    myTask.sort(function (a, b) {
      var statusA, statusB;
      statusA = a.status;
      statusB = b.status;
      return statusA > statusB ? -1 : statusA < statusB ? 1 : 0;
    });
    this.tasks = this.flatTaskArray(myTask);
  }

  isAscending() {
    if (this.isAscendingVar) {
      this.isAscendingVar = false;
    }
    else {
      this.isAscendingVar = true;
    }
    return this.isAscendingVar;
  }
}
