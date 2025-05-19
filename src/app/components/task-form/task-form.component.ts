import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  AbstractControl,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Task, TaskForm } from '../../model/Task';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-form',
  standalone: true,
  providers: [DatePipe],
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  @Output() onAddTask = new EventEmitter<Task>();
  @Output() onEditTask = new EventEmitter<Task>();

  showAddForm: boolean = false;
  subscription: Subscription;

  @Input() isEditForm: boolean = false;
  @Input() id: number | undefined;
  @Input() dateAdded: string | undefined;
  @Input() dueDate: string | undefined;
  @Input() textVal: string | undefined;
  @Input() priority: string | undefined;

  hasTextError: boolean = false;
  hasDueDateError: boolean = false;

  taskForm: any;

  ngOnInit() {
    this.taskForm = new FormGroup<TaskForm>({
      text: new FormControl(this.textVal ?? '', {
        nonNullable: true,
        validators: Validators.required,
      }),
      dueDate: new FormControl(this.dueDate ?? '', {
        nonNullable: true,
        validators: [Validators.required, this.dueDateValidator()],
      }),
      priority: new FormControl(this.priority ?? '1', { nonNullable: true }),
      isDone: new FormControl(false, { nonNullable: true }),
      dateAdded: new FormControl(
        this.dateAdded ??
          this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm')!,
        { nonNullable: true }
      ),
    });
  }

  constructor(
    private readonly datePipe: DatePipe,
    private readonly uiService: UiService
  ) {
    this.subscription = this.uiService
      .onToggleAddTask()
      .subscribe((value) => (this.showAddForm = value));
  }

  dueDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let date = control.value;

      const dateFormat =
        /\d{4}-(0[1-9]|1[1-2])-(0[1-9]|1\d|3[0-1])T\d{2}:\d{2}/;
      let isValid = dateFormat.test(date);

      date = new Date(date);
      if (date.getTime() < this.getMinDate().getTime()) {
        isValid = false;
      }

      return isValid
        ? null
        : {
            dueDate: {
              value: date,
            },
          };
    };
  }

  getMinDate() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - 60);
    date.setSeconds(0, 0);
    return date;
  }

  onSubmit() {
    if (!this.taskForm.valid) {
      return;
    }

    const newTask = this.taskForm.value;

    if (this.id != null) {
      newTask['id'] = this.id;
    }

    if (this.dateAdded != null) {
      newTask['dateAdded'] = this.dateAdded;
    }

    this.isEditForm
      ? this.onEditTask.emit(newTask)
      : this.onAddTask.emit(newTask);

    this.taskForm.reset();
  }
}
