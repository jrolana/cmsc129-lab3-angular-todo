import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Task } from '../../model/Task';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css'
})
export class TaskItemComponent {
  faTimes = faTimes;
  @Input({ required: true }) task: Task;
  @Output() onDeleteTask = new EventEmitter<Task>();
  @Output() onDoneTask = new EventEmitter<Task>();
  isDone: boolean = false;

  constructor() {
    this.task = {
      text: "",
      dueDate: "",
      priority: "",
      isDone: false,
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

  onToggleDone(task: Task) {
    console.log(this.isDone);

    task.isDone = this.isDone;

    this.onDoneTask.emit(task);
  }

}
