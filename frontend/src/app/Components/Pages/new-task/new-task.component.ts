import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/Services/task.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }

  listId: string;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId'];
      console.log(this.listId);
    });
  }

  createTask(title){
    this.taskService.createTask(title, this.listId).subscribe((task: any) => {
      console.log(task);
    });

    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
