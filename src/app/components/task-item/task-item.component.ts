import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../model/Task';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  @Input({ required: true }) task: Task = {
    text: '',
    dueDate: '',
    priority: '',
    isDone: false,
    dateAdded: '',
  };
  isDone: boolean = false;

  @Output() onDeleteTask = new EventEmitter<Task>();
  @Output() onEditTask = new EventEmitter<Task>();
  @Output() onDoneTask = new EventEmitter<Task>();

  @Input() showEditForm: boolean = false;

  constructor() {
  }

  getPriority(task: Task) {
    const prio: number = parseInt(task.priority);

    switch (prio) {
      case 1: {
        return "high";
      }
      case 2: {
        return "mid";
      }
      case 3: {
        return "low";
      }
      default: {
        return;
      }
    }
  }

  onDelete(task: Task) {
    this.onDeleteTask.emit(task);
  }

  onEdit(task: Task) {
    this.onEditTask.emit(task);
  }

  toggleShowEditForm(task: Task) {
    this.showEditForm = !this.showEditForm;
  }

  onToggleDone(task: Task) {
    task.isDone = this.isDone;
    this.onDoneTask.emit(task);
  }
}
