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
      let inputDate = control.value;

      const parsedDate = new Date(inputDate);

      if (isNaN(parsedDate.getTime())) {
        return {
          dueDate: { value: inputDate, message: 'Invalid date format' },
        };
      }

      const minDate = this.getMinDate();

      if (parsedDate.getTime() < minDate.getTime()) {
        return { dueDate: { value: inputDate, message: 'Date is too early' } };
      }

      return null;
    };
  }

  getMinDate() {
    const date = new Date();
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
    this.uiService.toggleShowTaskForm();
  }
}
