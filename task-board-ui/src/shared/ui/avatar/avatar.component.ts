import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    @if (src()) {
      <img
        [src]="src()"
        [alt]="name()"
        class="avatar"
        [class]="sizeClass()"
        loading="lazy"
      />
    } @else {
      <span class="avatar avatar-initials" [class]="sizeClass()" [style.background]="bgColor()">
        {{ initials() }}
      </span>
    }
  `,
  styles: [`
    :host { display: inline-flex; }
    .avatar {
      border-radius: 9999px;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }
    .avatar-initials {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #fff;
      font-size: 0.65em;
      text-transform: uppercase;
    }
    .sm { width: 24px; height: 24px; font-size: 10px; }
    .md { width: 32px; height: 32px; font-size: 12px; }
    .lg { width: 40px; height: 40px; font-size: 14px; }
  `]
})
export class AvatarComponent {
  readonly src = input<string | null>(null);
  readonly name = input<string>('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly sizeClass = computed(() => this.size());

  readonly initials = computed(() => {
    const n = this.name();
    if (!n) return '?';
    const parts = n.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`
      : n.substring(0, 2);
  });

  readonly bgColor = computed(() => {
    const colors = ['#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];
    const name = this.name();
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  });
}
