import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/Services/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/Models/task.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists:any[];
  tasks:any[];

  selectedListId: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      if(params.listId){
        this.selectedListId = params.listId;
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

  onDeleteList(){
    this.taskService.deleteList(this.selectedListId).subscribe((res:any) => {
      this.router.navigateByUrl('/lists');
      console.log(res);
    })
  }

  onTaskDelete(id:string){
    this.taskService.deleteTask(this.selectedListId, id).subscribe((res:any) => {
      // Removing the task from the task array:
      this.tasks = this.tasks.filter(val => val.id !== id);
      console.log(res);
    })
  }
}
