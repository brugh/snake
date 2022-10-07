import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { ElemComponent } from './elem.component';
import { FoodService } from './food.service';
import { GRID, Pos, SPEED } from './my.models';
import { SnakeService } from './snake.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ElemComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="gameboard" #gameboard [style.--gridsize]="gridsize">
      <ng-container *ngFor="let s of snake.snakeBody$ | async">
        <elem [pos]="s"></elem>
      </ng-container>
      <elem type="food" [pos]="food.foodPos$ | async"></elem>
    </div>
  `,
  styles: [`
    #gameboard {
      background-color: #CCC;
      width: 100vmin;
      height: 100vmin;
      display: grid;
      grid-template-columns: repeat(var(--gridsize), 1fr);
      grid-template-rows: repeat(var(--gridsize), 1fr);
    }
    .snake {
      background-color: hsl(200, 100%, 50%);
      border: .25vmin solid black;
    }
    .food {
      background-color: hsl(50, 100%, 50%);
      border: .25vmin solid black;
    }
  `]
})
export class MyComponent implements OnInit {
  @ViewChild('gameboard', { static: false }) gameboard?: ElementRef<HTMLElement>;
  @HostListener('document:keydown', ['$event']) keyDown =
    (event: KeyboardEvent) => this.checkKey(event);
  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event']) handleTouch =
    (event: TouchEvent) => this.checkTouch(event);

  direction: Pos = { x: 0, y: 0 };
  previousDir: Pos = { x: 0, y: 0 };
  previous = 0;
  gameover = false;
  touch1 = { x: 0, y: 0, time: 0 };
  gridsize = GRID;
  speed = SPEED;

  constructor(
    private changeDetection: ChangeDetectorRef,
    public snake: SnakeService,
    public food: FoodService
  ) { }

  ngOnInit(): void {
    this.animate(0);
  }

  animate(currentTime: number) {
    if (this.gameover) {
      if (confirm(`Game over! Your score is ${this.snake.bodyLength()}.\nPress OK to restart.`)) {
        window.location = window.location;
      }
      return;
    }
    window.requestAnimationFrame((currentTime) => this.animate(currentTime));
    const since = (currentTime - this.previous) / 1000;
    if (since < 1 / this.speed) return;
    this.previous = currentTime;
    this.update();
  }

  update() {
    this.previousDir = this.direction;

    this.snake.update(this.direction);
    this.food.update();

    this.gameover = this.checkState();

    this.changeDetection.detectChanges();
  }

  checkState() {
    return this.outsizeGrid(this.snake.snakeHead()) || this.snake.intersect();
  }

  outsizeGrid(pos: Pos) {
    return (
      pos.x < 1 || pos.x > GRID ||
      pos.y < 1 || pos.y > GRID
    )
  }

  move(dir: string) {
    switch (dir) {
      case 'up':
        if (this.previousDir.y !== 0) break;
        this.direction = { x: 0, y: -1 }
        break;
      case 'down':
        if (this.previousDir.y !== 0) break;
        this.direction = { x: 0, y: 1 }
        break;
      case 'left':
        if (this.previousDir.x !== 0) break;
        this.direction = { x: -1, y: 0 }
        break;
      case 'right':
        if (this.previousDir.x !== 0) break;
        this.direction = { x: 1, y: 0 }
        break;
    }
  }

  checkKey(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp': this.move('up'); break;
      case 'ArrowDown': this.move('down'); break;
      case 'ArrowLeft': this.move('left'); break;
      case 'ArrowRight': this.move('right'); break;
    }
  };

  checkTouch(event: TouchEvent) {
    var touch = event.touches[0] || event.changedTouches[0]; // skip multitouch
    switch (event.type) {
      case 'touchstart':
        this.touch1 = { x: touch.pageX, y: touch.pageY, time: event.timeStamp };
        break;
      case 'touchend':
        const dx = touch.pageX - this.touch1.x,
          dy = touch.pageY - this.touch1.y,
          dt = event.timeStamp - this.touch1.time
        if (dt > 500) break; // long press
        if (Math.abs(dx) > Math.abs(dy)) { // horizontal
          if (dx > 0) return this.move('right')
          return this.move('left');
        } else {
          if (dy > 0) return this.move('down')
          return this.move('up');
        }
        break;
      case 'touchmove':
        event.preventDefault();
        break;
    }
  }
}

