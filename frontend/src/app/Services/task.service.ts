import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private service: WebRequestService) {}

  // Logic for lists:

  createList(title: string) {
    return this.service.post('lists', { title })
  }

  deleteList(id:string){
    return this.service.delete(`lists/${id}`)
  }

  editList(id: string, title:string){
    return this.service.patch( `lists/${id}`, title);
  }

  getAllLists(){
    return this.service.get('lists');
  }

  getTasks(listId: string){
    return this.service.get(`lists/${listId}/tasks`)
  }

  // Logic for tasks:

  createTask(title: string, listId: string) {
    return this.service.post(`lists/${listId}/tasks`, { title })
  }

  complete(task: any){
    return this.service.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }

  deleteTask(listId: string, taskId: string){
    return this.service.delete(`lists/${listId}/tasks/${taskId}`);
  }

  editTask(listId: string, taskId: string, title: string){
    return this.service.patch(`lists/${listId}/tasks/${taskId}`, {title});
  }
}
