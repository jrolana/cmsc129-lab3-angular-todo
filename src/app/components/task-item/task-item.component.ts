import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../model/Task';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  faTimes = faTimes;
  @Input({ required: true }) task: Task;
  @Output() onDeleteTask = new EventEmitter<Task>();
  @Output() onToggleReminder = new EventEmitter<Task>();

  constructor() {
    this.task = {
      text: "",
      dueDate: "",
      priority: "",
    }
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



}
