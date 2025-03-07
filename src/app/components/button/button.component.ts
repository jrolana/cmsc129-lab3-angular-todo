import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() color: string = "green";
  @Input() text: string = "Add";
  @Output() btnClick = new EventEmitter();

  onClick() {
    this.btnClick.emit();
  }
}
