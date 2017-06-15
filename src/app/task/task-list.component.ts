import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Task } from "./task";
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  private tasks: Task[];
  private sortedBy: string = "deadline";
  private requestStatus: string = null;
  private requestText: string;
  private filterQuery: string = 'assignee=me';

  constructor(private ts: TaskService, private router: Router) { }

  ngOnInit() {
    this.requestStatus = "running";
    this.ts.getTasks().subscribe(
      (tasks) => {
        this.tasks = [];
        for (let task of tasks) {
          let t = new Task(
            task.$key,
            task.title,
            task.description,
            task.priority,
            null,
            task.createdBy, 
            task.assignee,
            task.status
          );
          t.setDeadlineFromISO(task.deadline);
          this.tasks.push(t);
        }
        this.sort();
        this.requestStatus = "ok";
      }
      , ((err) => {
        this.requestStatus = "ko";
        this.requestText = err;
      }
      ));

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
        if (b.getDeadline() == null) { // Put the no deadline at the end. 
          return -1;
        }
        if (a.getDeadline() == null) {
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

        if (b.getDeadline() == null) { // Put the no deadline at the end. 
          return -1;
        }
        if (a.getDeadline() == null) {
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

  isLoading(){
    if(this.requestStatus === "running"){
      return true;
    }
    else{
      return false; 
    }
  }

  errorOccurs(){
    if(this.requestStatus === "ko"){
      return true; 
    }
    else{
      return false; 
    }
  }

  filter(q:string):void {
    
    let c = RegExp(q);

    if(this.filterQuery === ''){ // si le query est vide, j'y mets l'élément. 
      this.filterQuery = q;
    }

    else if(c.test(this.filterQuery)) { // si le query contient l'élément, je l'enlève' 
      let p:number = this.filterQuery.search(c);
      
      if(p>0){ // ce n'est pas le premier élément de la liste, on supprime donc le caractère avant qui est & ou |
        this.filterQuery = this.filterQuery.slice(0,p-1) + this.filterQuery.slice(p);
      }
      this.filterQuery = this.filterQuery.replace(c,'');
    }

    else{ // si le query ne le contient pas, je l'y ajoute. 
      this.filterQuery = this.filterQuery + '&' + q;
    }

    let notFirst = new RegExp(/^\||^&/)

    if(notFirst.test(this.filterQuery)){ // Remove & ou | si présent en début de chaine. 
      this.filterQuery = this.filterQuery.slice(1);
    } 
  }
}