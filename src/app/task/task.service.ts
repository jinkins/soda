import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Task } from './task';
import { URL } from '../params';

@Injectable()
export class TaskService {

  constructor(private db: AngularFireDatabase) { }

  getTasks() {
   return this.db.list('/tasks');
  }

  getTask(id: string) {
    return this.db.object('/tasks/'+id);
  }

  addTask(task: Task) {
    return this.db.list('/tasks/').push({
      title: task.getTitle(),
      description: task.getDescription(), 
      priority: task.getPriority().toString(),
      deadline: task.getDeadline()
    })

  }

}