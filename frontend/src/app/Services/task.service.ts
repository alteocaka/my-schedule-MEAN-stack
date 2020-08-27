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
}
