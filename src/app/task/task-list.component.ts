import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Task } from "./task";
import { TaskService } from './task.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  private tasks: Task[];
  private sortedBy: string = "deadline";
  private socket: io; 

  constructor(private ts: TaskService, private router: Router) { }

  ngOnInit() {
    this.ts.getTasks().subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks;
        this.sort();
      }
    ); 


  }

  sortBy(c: string): void { // Change the sorting. 
    if (this.sortedBy === c) {
      this.tasks.reverse();
    }
    else {
      this.sortedBy = c;
      this.sort();
    }
  }

  sort() { // Sort the tasklist according to the sortedBy criteria. 
    if (this.sortedBy === "deadline")
      this.tasks.sort((a, b) => {
        if(b.getDeadline() == null) { // Put the no deadline at the end. 
          return -1; 
        }
        if(a.getDeadline() == null){
          return 1; 
        }
        let diff = a.diffDays(b.getDeadline());
        if (diff > 0) {
          return 1;
        }
        else if (diff < 0) {
          return -1;
        }
        else if (a.getPriority() < b.getPriority()) {
          return -1;
        }

        else if (a.getPriority() > b.getPriority()) {
          return 1;
        }

        else {
          return 0
        }
      })


    else if (this.sortedBy === "priority")
      this.tasks.sort((a, b) => {
        if (a.getPriority() > b.getPriority()) {
          return 1;
        }

        else if (a.getPriority() < b.getPriority()) {
          return -1;
        }

        if(b.getDeadline() == null) { // Put the no deadline at the end. 
          return -1; 
        }
        if(a.getDeadline() == null){
          return 1; 
        }

        let diff = a.diffDays(b.getDeadline());
        if (diff > 0) {
          return 1;
        }
        else if (diff < 0) {
          return -1;
        }
      })
  }
}