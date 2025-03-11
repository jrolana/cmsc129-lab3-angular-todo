import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormGroup, FormControl, ReactiveFormsModule, AbstractControl,
  Validators, ValidatorFn, ValidationErrors,
} from '@angular/forms';
import { Task, TaskForm } from '../../model/Task';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',

})

export class TaskFormComponent {
  @Output() onAddTask = new EventEmitter<Task>();
  @Output() onEditTask = new EventEmitter<Task>();
  showAddForm: boolean = false;
  subscription: Subscription;

  @Input() isEditForm: boolean = false;
  @Input() id: any;
  @Input() dateAdded: any;
  @Input() textVal: any;

  hasTextError: boolean = false;
  hasDueDateError: boolean = false;

  taskForm = new FormGroup<TaskForm>({
    text: new FormControl("", { nonNullable: true, validators: Validators.required }),
    dueDate: new FormControl("", { nonNullable: true, validators: [Validators.required, this.dueDateValidator()] }),
    priority: new FormControl("1", { nonNullable: true }),
    isDone: new FormControl(false, { nonNullable: true }),
    dateAdded: new FormControl(this.datePipe.transform(new Date(), "yyyy-MM-ddThh:mm")!,
      { nonNullable: true }),
  })

  constructor(private readonly datePipe: DatePipe, private readonly uiService: UiService) {
    this.subscription = this.uiService.onToggleAddTask().subscribe(value => this.showAddForm = value);
  }

  dueDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = control.value;
      const dateFormat = /\d{4}-(0[1-9]|1[1-2])-(0[1-9]|1[1-2]|3[0-1])T\d{2}:\d{2}/;
      let isValid = dateFormat.test(date);

      if (date < this.getMinDate()!) {
        isValid = false;
      }

      return isValid ? null : {
        dueDate: {
          value: date
        }
      };
    }
  }

  getMinDate() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 60);
    date.setSeconds(0, 0);
    const minDate = this.datePipe.transform(date, "yyyy-MM-ddThh:mm")
    return minDate;
  }

  onSubmit() {
    if (this.taskForm.controls['text'].errors) {
      this.hasTextError = true;
    }

    if (this.taskForm.controls['dueDate'].errors) {
      this.hasDueDateError = true;
    }

    if (this.hasDueDateError || this.hasTextError) {
      return;
    }

    const newTask = this.taskForm.getRawValue();

    if (this.id != null) {
      newTask["id"] = this.id;
    }

    if (this.dateAdded != null) {
      newTask["dateAdded"] = this.dateAdded;
    }

    this.isEditForm ? this.onEditTask.emit(newTask) : this.onAddTask.emit(newTask);

    if (!this.hasDueDateError && !this.hasTextError) {
      this.taskForm.patchValue({
        text: '',
        dueDate: '',
        priority: '',
        isDone: false,
      });
    }
  }
}
