import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './empty.html',
  styleUrls: ['./empty.css']
})
export class Empty {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() buttonText: string = '';
  @Input() icon: string = 'fas fa-inbox';

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}
