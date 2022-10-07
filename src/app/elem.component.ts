import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Pos } from './my.models';

@Component({
  selector: 'elem',
  standalone: true,
  template: `
    <ng-container #elem ></ng-container>
  `,
  styles: [`

  `]
})
export class ElemComponent implements AfterViewChecked {
  @ViewChild('elem') elem!: ElementRef<HTMLElement>;
  @Input() pos!: Pos | null;
  @Input() type: 'snake' | 'food' = 'snake';

  ngAfterViewChecked(): void {
    const _p = this.elem.nativeElement.parentElement;
    if (!_p) return;
    _p.classList.add(this.type);
    _p.style.gridColumnStart = '' + this.pos?.x;
    _p.style.gridRowStart = '' + this.pos?.y;
  }
}
