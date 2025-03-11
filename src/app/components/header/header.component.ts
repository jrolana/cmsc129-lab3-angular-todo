import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showAddForm: boolean = false;
  subscription: Subscription;

  constructor(private readonly uiService: UiService) {
    this.subscription = this.uiService.onToggleAddTask().subscribe(value => this.showAddForm = value);
  }

  toggleshowTaskForm() {
    this.uiService.toggleShowTaskForm();
  }
}
