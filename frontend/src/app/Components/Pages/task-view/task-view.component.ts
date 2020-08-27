import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/Services/task.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Task } from 'src/app/Models/task.model';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists:any[];
  tasks:any[];

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      if(params.listId){
        this.taskService.getTasks(params.listId).subscribe((tasks: any) => {
          this.tasks = tasks;
          console.log(tasks);
        })
      }
      else{
        this.tasks = undefined
      }
      console.log(params);
    })


    this.taskService.getAllLists().subscribe((lists:any[]) => {
      console.log(lists);
      this.lists = lists
    });
  }

  onTaskClick(task: Task){
    // Function for setting the taskl to "completed":
    this.taskService.complete(task).subscribe(() => {
      console.log('Completed successfully!');
      task.completed = !task.completed;
    })
  }

}
