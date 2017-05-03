import { Routes, RouterModule } from "@angular/router";

import { TaskListComponent } from './task-list.component';
import { TaskDetailComponent } from './task-detail.component'

export const TASK_ROUTES: Routes = [
    { path: ':id', component: TaskDetailComponent }
]; 