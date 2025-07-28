import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Feature } from '../../../../core/models/static.model';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
    templateUrl: './features-section.html',
  styleUrls: ['./features-section.css']

})
export class FeaturesSection {
  features: Feature[] = [
    {
      icon: 'local_shipping',
      title: 'features.freeShipping.title',
      description: 'features.freeShipping.description'
    },
    {
      icon: 'assignment_return',
      title: 'features.easyReturns.title',
      description: 'features.easyReturns.description'
    },
    {
      icon: 'verified_user',
      title: 'features.securePayments.title',
      description: 'features.securePayments.description'
    }
  ];
}