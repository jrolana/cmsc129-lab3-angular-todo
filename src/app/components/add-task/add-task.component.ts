import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskForm } from '../../model/Task';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',

})
export class AddTaskComponent {
  @Output() onAddTask = new EventEmitter<Task>();

  taskForm = new FormGroup<TaskForm>({
    text: new FormControl('', { nonNullable: true, validators: Validators.required }),
    dueDate: new FormControl('', { nonNullable: true, validators: Validators.required }),
    priority: new FormControl("", { nonNullable: true }),
  })

  // @todo: Create a validator for time

  onSubmit() {
    const newTask = this.taskForm.getRawValue();

    console.log(newTask);

    this.onAddTask.emit(newTask);

    this.taskForm.patchValue({
      text: '',
      dueDate: '',
      priority: '',
    });
  }
}
