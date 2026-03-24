import {
  Component,
  input,
  computed,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AY_ICONS } from './icons';

@Component({
  selector: 'ay-icon',
  standalone: true,
  host: {
    'class': 'ay-icon',
    '[attr.aria-hidden]': '!ariaLabel()',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.role]': 'ariaLabel() ? "img" : null',
  },
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class AyIconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<string>();
  readonly size = input<string | number>('1em');
  readonly ariaLabel = input<string>('');

  readonly sizeValue = computed(() => {
    const s = this.size();
    return typeof s === 'number' ? `${s}px` : s;
  });

  readonly svgHtml = computed(() => {
    const iconPath = AY_ICONS[this.name()];
    if (!iconPath) return this.sanitizer.bypassSecurityTrustHtml('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="${this.sizeValue()}" height="${this.sizeValue()}" fill="none">${iconPath}</svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}
