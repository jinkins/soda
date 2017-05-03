import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/rx";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Task } from './task';


import {
  FormArray,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";

import { TaskService } from './task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

  sub: Subscription;
  id: string;
  modeEdit: boolean = false;
  taskForm: FormGroup;
  task: Task;
  withDeadline: boolean = true;
  results: any; 


  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private ts: TaskService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.id = params['id'];
          if (this.id === 'new') {
            this.modeEdit = false;
            this.initForm();
          }
          else {
            this.modeEdit = true;
            // DUMMY
            this.ts.getTask(this.id).subscribe(
              (task: Task) => {
                this.task = task;
                if (this.task.getDeadline()) {
                  this.withDeadline = true;
                }
                else {
                  this.withDeadline = false;
                }
                this.initForm();
              }
            )
          }
        }
      }
    );
    this.initForm()
  }

  initForm() {
    let t: string;
    let d: string;
    let dl: Date = new Date();
    let p: number = 3;
    let withDl = this.withDeadline;

    if (this.modeEdit && this.task) {
      t = this.task.getTitle();
      d = this.task.getDescription();
      dl = this.task.getDeadline();
      p = this.task.getPriority();
      if (dl == null) {
        this.withDeadline = false;
        dl = new Date();
      }
    }

    this.taskForm = this.formBuilder.group({
      title: [t, Validators.required],
      description: [d],
      deadline: [{ value: dl.toISOString().substring(0, 10), disabled: !(this.withDeadline) }],
      withDl: [withDl],
      priority: [p, Validators.required]
    })


    this.taskForm.controls['withDl'].statusChanges.subscribe(
      () => {
        if (!this.taskForm.value["withDl"]) {
          this.taskForm.controls["deadline"].enable()
        } else {
          this.taskForm.controls["deadline"].disable()
        }
      }
    )

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnChanges() {
    if (typeof (this.taskForm.value['noDl']) != "undefined") {
      this.withDeadline = this.taskForm.value['withDl'];
    }
  }

  onSubmit() {

    this.task = new Task(
      null,
      this.taskForm.value['title'],
      this.taskForm.value['description'],
      Number(this.taskForm.value['priority']),
      new Date(this.taskForm.value['deadline'])
    );

    if (this.id != "new") {
      this.task.setId(this.id);

    }

    else {
      this.ts.addTask(this.task); 
    }


    console.log(this.task);
  }

  statusButton(){
    if(!this.results){
      return "btn btn-primary";
    }
    if(this.results.status == 500){
      return "btn btn-error";
    }
    else if (this.results.status == 201) {
      return "btn btn-success";
    }
    else{
      return "btn btn-warning";
    }
  }

  loading(){
    if(!this.results){
      return "";
    }

    else if(this.results.status == 201){
      return "fa fa-check-circle";
    }
    
    else if(this.results.status == 500){
      return "fa fa-exclamation";
    }

    else{
      return "fa fa-cog fa-spin fa-3x fa-fw";
    }
  }

  response(){
    if(!this.results){
      return ""
    }
    else{
      return this.results.title
    }
  }

}
