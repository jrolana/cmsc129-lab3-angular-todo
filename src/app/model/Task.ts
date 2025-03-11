import { FormControl } from '@angular/forms';

export interface Task {
    id?: number,
    text: string,
    dueDate: string,
    priority: string,
    isDone: boolean,
    dateAdded: string,
}

type ToFormControls<T> = {
    [K in keyof T]: FormControl<T[K]>;
};

export type TaskForm = ToFormControls<Task>;