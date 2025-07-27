import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.css']
})
export class Loader {
  @Input() message: string = 'products.loading';


}
