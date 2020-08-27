import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskViewComponent } from './Components/Pages/task-view/task-view.component';
import { NewListComponent } from './Components/Pages/new-list/new-list.component';
import { NewTaskComponent } from './Components/Pages/new-task/new-task.component';
import { LoginPageComponent } from './Components/Pages/login-page/login-page.component';

const routes: Routes = [
  {path: '', redirectTo: 'lists', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {path: 'new-list', component:NewListComponent},
  {path: 'lists/:listId/new-task', component: NewTaskComponent},
  {path: 'lists/:listId', component: TaskViewComponent},
  {path: 'lists', component: TaskViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
