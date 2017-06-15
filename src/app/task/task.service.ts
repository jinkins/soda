import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../shared/auth.service'; 

import { Task } from './task';

@Injectable()
export class TaskService {
  constructor(private db: AngularFireDatabase, private as: AuthService) { }

  getTasks() {
    return this.db.list('/tasks');
  }

  getTask(id: string) {
    return this.db.object('/tasks/' + id);
  }

  addTask(task: Task) {
    return this.db.list('/tasks/').push({
      title: task.getTitle(),
      description: task.getDescription(),
      priority: task.getPriority().toString(),
      deadline: task.getDeadline().toJSON(),
      createBy: this.as.getUid()
    })
  }

  editTask(task: Task) {
    return this.db.object('/tasks/' + task.getId()).update({
      title: task.getTitle(),
      description: task.getDescription(),
      priority: task.getPriority().toString(),
      deadline: task.getDeadline().toJSON()
    })
  }

  deleteTask(id:string){
    return this.db.object('tasks/'+id).remove(); 
  }
}