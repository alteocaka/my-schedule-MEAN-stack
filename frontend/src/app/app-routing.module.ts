import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskViewComponent } from './Components/Pages/task-view/task-view.component';
import { NewListComponent } from './Components/Pages/new-list/new-list.component';
import { NewTaskComponent } from './Components/Pages/new-task/new-task.component';
import { LoginPageComponent } from './Components/Pages/login-page/login-page.component';
import { SignupPageComponent } from './Components/Pages/signup-page/signup-page.component';
import { EditListComponent } from './Components/Pages/edit-list/edit-list.component';
import { EditTaskComponent } from './Components/Pages/edit-task/edit-task.component';

const routes: Routes = [
  {path: '', redirectTo: 'lists', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {path: 'signup', component: SignupPageComponent},
  {path: 'new-list', component:NewListComponent},
  {path: 'edit-list/:listId', component:EditListComponent},
  {path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent},
  {path: 'lists/:listId/new-task', component: NewTaskComponent},
  {path: 'lists/:listId', component: TaskViewComponent},
  {path: 'lists', component: TaskViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
