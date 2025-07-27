import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="grid gap-6" 
      [ngClass]="{
        'grid-cols-1': viewMode === 'list',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': viewMode === 'grid'
      }"
    >
      @for (item of skeletonItems; track $index) {
        <div class="w-full h-[500px] flex flex-col justify-between rounded-md overflow-hidden shadow-sm bg-gray-100 animate-pulse">
          <div class="flex-1">
            <div class="bg-gray-300 h-[228px] w-full"></div>
            <div class="p-4 space-y-2">
              <div class="h-4 bg-gray-300 w-1/2 rounded"></div>
              <div class="h-6 bg-gray-300 w-3/4 rounded"></div>
              <div class="h-3 bg-gray-300 w-full rounded"></div>
              <div class="h-3 bg-gray-300 w-5/6 rounded"></div>
              <div class="h-5 bg-gray-300 w-1/3 rounded"></div>
            </div>
          </div>
          <div class="flex gap-2 p-4">
            <div class="h-[56px] flex-1 bg-gray-300 rounded"></div>
            <div class="h-[56px] w-[50px] bg-gray-300 rounded"></div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductsSkeleton {
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() count: number = 12;

  get skeletonItems(): number[] {
    return Array(this.count).fill(0);
  }
}