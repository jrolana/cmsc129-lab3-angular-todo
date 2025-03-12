import { Component } from '@angular/core';
import { Task } from '../../model/Task';
import { TASKS } from '../../model/mock-tasks';
import { TaskItemComponent } from "../task-item/task-item.component";
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from "../task-form/task-form.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskItemComponent, TaskFormComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  tasks: Task[] = TASKS;
  isDone: boolean = false;
  sortBy = new FormControl('', { nonNullable: true });

  showAddForm: boolean = false;
  subscription: Subscription;

  constructor(private readonly taskService: TaskService, private readonly uiService: UiService) {
    this.taskService.getTasks().subscribe((tasks) =>
      this.tasks = tasks);
    this.subscription = this.uiService.onToggleAddTask().subscribe(value => this.showAddForm = value);

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
    this.taskService.addTask(task).subscribe((task) => this.tasks.unshift(task));
  }

  toggleDone(task: Task) {
    this.taskService.editTask(task).subscribe(() => {
      for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id == task.id) {
          this.tasks.splice(i, 1);
          break;
        }
      }
      this.tasks.push(task);
    });
  }

  sortFunc(criteria: string): void {
    let order: any = criteria[0];
    let field = criteria.slice(1) as keyof Task;

    if (order == "-") {
      order = -1;
    } else {
      order = 1;
    }

    this.tasks.sort((a, b) => {
      let comparison = 0;

      if (a[field]! > b[field]!) {
        comparison = 1;
      } else if (a[field]! < b[field]!) {
        comparison = -1;
      }

      if (order === -1) {
        comparison *= -1;
      }

      return comparison;
    });
  }
}
