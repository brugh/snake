import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FoodService } from './food.service';
import { GRID, Pos, SPEED } from './my.models';
import { SnakeService } from './snake.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="gameboard" #gameboard>
      <ng-container *ngFor="let s of snake.snakeBody$ | async">
        <elem [pos]="s"></elem>
      </ng-container>
      <elem [type]="'food'" [pos]="food.foodPos$ | async"></elem>
    </div>
  `,
  styles: [`
    #gameboard {
      background-color: #CCC;
      width: 100vmin;
      height: 100vmin;
      display: grid; 
      grid-template-rows: repeat(${GRID}, 1fr);
      grid-template-columns: repeat(${GRID}, 1fr);
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
  @HostListener('document:keydown', ['$event']) keyDown = (event: KeyboardEvent) => this.checkKey(event);
  @ViewChild('gameboard', { static: false }) gameboard?: ElementRef<HTMLElement>;

  direction: Pos = { x: 0, y: 0 };
  previousDir: Pos = { x: 0, y: 0 };
  previous = 0;
  gameover = false;

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
    if (since < 1 / SPEED) return;
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

  checkKey(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (this.previousDir.y !== 0) break;
        this.direction = { x: 0, y: -1 }
        break;
      case 'ArrowDown':
        if (this.previousDir.y !== 0) break;
        this.direction = { x: 0, y: 1 }
        break;
      case 'ArrowLeft':
        if (this.previousDir.x !== 0) break;
        this.direction = { x: -1, y: 0 }
        break;
      case 'ArrowRight':
        if (this.previousDir.x !== 0) break;
        this.direction = { x: 1, y: 0 }
        break;
    }
  };
}
