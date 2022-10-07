import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'elem',
  template: `
    <ng-container #elem ></ng-container>
  `,
  styles: [`

  `]
})
export class SnakeComponent implements AfterViewChecked {
  @ViewChild('elem') elem!: ElementRef<HTMLElement>;
  @Input() pos!: { x: number, y: number };
  @Input() type: 'snake' | 'food' = 'snake';

  ngAfterViewChecked(): void {
    const _p = this.elem.nativeElement.parentElement;
    if (!_p) return;
    _p.classList.add(this.type);
    _p.style.gridColumnStart = '' + this.pos.x;
    _p.style.gridRowStart = '' + this.pos.y;
  }

}
