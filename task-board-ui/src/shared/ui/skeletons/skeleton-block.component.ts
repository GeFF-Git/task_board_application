import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="skeleton-pulse" 
      [ngStyle]="{
        'width': width,
        'height': height,
        'border-radius': borderRadius,
        'margin': margin
      }">
    </div>
  `,
  styles: [`
    .skeleton-pulse {
      background: var(--skeleton-bg, rgba(255, 255, 255, 0.05));
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    :host-context(.light) .skeleton-pulse {
      --skeleton-bg: rgba(0, 0, 0, 0.06);
    }
  `]
})
export class SkeletonBlockComponent {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() borderRadius = '4px';
  @Input() margin = '0';
}
