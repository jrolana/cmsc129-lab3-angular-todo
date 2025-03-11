import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private showAddForm: boolean = false;
  private readonly addFormSubject = new Subject<any>();

  constructor() { }

  toggleShowTaskForm() {
    this.showAddForm = !this.showAddForm;
    this.addFormSubject.next(this.showAddForm);
  }

  onToggleAddTask(): Observable<any> {
    return this.addFormSubject.asObservable();
  }

}
