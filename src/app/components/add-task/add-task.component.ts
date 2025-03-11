import { Component, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormGroup, FormControl, ReactiveFormsModule, AbstractControl,
  Validators, ValidatorFn, ValidationErrors,
} from '@angular/forms';
import { Task, TaskForm } from '../../model/Task';
import { min } from 'rxjs';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',

})
export class AddTaskComponent {
  @Output() onAddTask = new EventEmitter<Task>();

  taskForm = new FormGroup<TaskForm>({
    text: new FormControl('', { nonNullable: true, validators: Validators.required }),
    dueDate: new FormControl('', { nonNullable: true, validators: [Validators.required, this.dueDateValidator()] }),
    priority: new FormControl("", { nonNullable: true }),
    isDone: new FormControl(false, { nonNullable: true }),
  })

  constructor(private readonly datePipe: DatePipe) {
  }

  dueDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = control.value;
      const dateFormat = /\d{4}-(0[1-9]|1[1-2])-(0[1-9]|1[1-2]|3[0-1])T\d{2}:\d{2}/;
      let isValid = dateFormat.test(date);

      // console.log("PATTERN");
      // console.log(dateFormat);
      // console.log("PATTERN MATCHED?");
      // console.log(isValid);

      // @TODO: Distinguish between AM and PM
      if (date < this.getMinDate()!) {
        isValid = false;
      }

      // console.log("MIN DATE");
      // console.log(this.getMinDate());
      // console.log("ENTERED?")
      // console.log(date);
      // console.log("VALID?")
      // console.log(isValid);

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
    const newTask = this.taskForm.getRawValue();

    this.onAddTask.emit(newTask);
    this.taskForm.patchValue({
      text: '',
      dueDate: '',
      priority: '',
      isDone: false,
    });

  }
}
