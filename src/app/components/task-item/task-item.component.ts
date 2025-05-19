import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../model/Task';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import {
  faTrash,
  faPenToSquare,
  faFontAwesomeFlag,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {
  faTrash = faTrash;
  faPenToSquare = faPenToSquare;
  faFontAwesomeFlag = faFontAwesomeFlag;

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

  getColorPriority(priority: string) {
    switch (priority) {
      case '1': {
        return 'red';
      }
      case '2': {
        return 'orange';
      }
      case '3': {
        return 'green';
      }
      default: {
        return;
      }
    }
  }

  getPriority(priority: string) {
    switch (priority) {
      case '1': {
        return 'High Priority';
      }
      case '2': {
        return 'Medium Priority';
      }
      case '3': {
        return 'Low Priority';
      }
      default: {
        return;
      }
    }
  }

  isDueLater(dueDate: string) {
    const due = new Date(dueDate);
    const today = new Date();

    if (due.getDate() > today.getDate()) {
      return 'due-later';
    } else {
      return 'due';
    }
  }

  formatDueDate(dueDate: string) {
    const due = new Date(dueDate);
    const today = new Date();

    const isDueToday = due.getDate() === today.getDate();

    if (isDueToday) {
      return `Today, ${due.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`;
    } else {
      return due.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
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
    this.onDoneTask.emit(task);
  }
}
