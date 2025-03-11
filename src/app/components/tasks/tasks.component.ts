import { Component } from '@angular/core';
import { Task } from '../../model/Task';
import { TASKS } from '../../model/mock-tasks';
import { TaskItemComponent } from "../task-item/task-item.component";
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from "../task-form/task-form.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskItemComponent, TaskFormComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  tasks: Task[] = TASKS;
  isDone: boolean = false;

  constructor(private readonly taskService: TaskService) {
    this.taskService.getTasks().subscribe((tasks) =>
      this.tasks = tasks);
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task).subscribe(() => (this.tasks = this.tasks.filter((t) => t.id !== task.id)));
  }

  editTask(task: Task) {
    this.taskService.editTask(task).subscribe(() => {
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id == task.id) {
          this.tasks[i] = task;
          break;
        }
      }
    });
  }

  addTask(task: Task) {
    this.taskService.addTask(task).subscribe((task) => this.tasks.push(task));
  }

  toggleDone(task: Task) {
    this.taskService.editTask(task).subscribe();
  }
}
