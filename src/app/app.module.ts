import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { HttpModule } from '@angular/http';

import { AppComponent } from "./app.component";
import { TaskListComponent } from './task/task-list.component';
import { TaskDetailComponent } from './task/task-detail.component';

import { routing } from './app.routing';

import { TaskService } from './task/task.service';

export const config = {
    apiKey: "AIzaSyCTwOUBh2fUqdsInWVT3ErgtJYKpqEbopk",
    authDomain: "soda-86d3e.firebaseapp.com",
    databaseURL: "https://soda-86d3e.firebaseio.com",
    projectId: "soda-86d3e",
    storageBucket: "soda-86d3e.appspot.com",
    messagingSenderId: "473948420930"
};

@NgModule({
    declarations: [
        AppComponent,
        TaskListComponent,
        TaskDetailComponent,
        

    ],
    imports: [
        BrowserModule, routing, ReactiveFormsModule, FormsModule, HttpModule,
        AngularFireModule.initializeApp(config)
    ],
    providers: [TaskService],
    bootstrap: [AppComponent]
})
export class AppModule {

}