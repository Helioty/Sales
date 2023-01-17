import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  imports: [CommonModule],
})
export class FormErrorComponent {
  @Input() errorMessage: string;
  @Input() showError: boolean;
  @Input() colorWhite = false;

  constructor() {}
}
