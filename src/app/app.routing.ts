import { Routes, RouterModule } from "@angular/router";

import { TaskListComponent } from './task/task-list.component';
import { HomeComponent } from './home/home.component';
import { TASK_ROUTES } from './task/tasking.routing';

const APP_ROUTES: Routes = [
    { path: '', component: HomeComponent, pathMatch: "full" },
    { path: 'task', component: TaskListComponent, children:TASK_ROUTES }
]; 

export const routing = RouterModule.forRoot(APP_ROUTES);