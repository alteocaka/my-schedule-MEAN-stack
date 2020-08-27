import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './Components/Pages/task-view/task-view.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WebReqInterceptorService } from './Interceptors/web-req-interceptor.service';
import { NewListComponent } from './Components/Pages/new-list/new-list.component';
import { NewTaskComponent } from './Components/Pages/new-task/new-task.component';
import { LoginPageComponent } from './Components/Pages/login-page/login-page.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewListComponent,
    NewTaskComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
