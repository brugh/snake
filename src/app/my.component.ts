import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

const GRID = 21;
const SPEED = 5;
const EXPAND = 3;
interface Pos {
  x: number, y: number
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="gameboard" #gameboard>
      <ng-container *ngFor="let s of snakeBody">
        <elem [pos]="s"></elem>
      </ng-container>
      <elem #food [type]="'food'" [pos]="foodPos"></elem>
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
  key = '';
  snakeBody: Pos[] = [{ x: Math.round(GRID / 2), y: Math.round(GRID / 2) }];
  foodPos: Pos = this.newPos();
  gameover = false;
  newSegments = 0;

  constructor(private changeDetection: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.animate(0);
  }

  animate(currentTime: number) {
    if (this.gameover) {
      if (confirm(`Game over! Your score is ${this.snakeBody.length}.\nPress OK to restart.`)) {
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
    this.addSegments();

    this.snakeBody = [
      {
        x: this.snakeBody[0].x + this.direction.x,
        y: this.snakeBody[0].y + this.direction.y
      },
      ...this.snakeBody
    ];
    this.snakeBody.pop();

    if (this.onSnake(this.foodPos)) {
      this.newSegments = EXPAND;
      this.foodPos = this.newPos();
    }

    this.checkState();

    this.changeDetection.detectChanges();
  }


  newPos() {
    const rnd = () => {
      return { x: Math.floor(Math.random() * 21 + 1), y: Math.floor(Math.random() * 21 + 1) };
    };
    let p: Pos;
    do { p = rnd(); } while (this.onSnake(p));
    return p;
  }

  onSnake(pos: Pos, { ignoreHead = false } = {}) {
    return this.snakeBody.some((seg: Pos, index: number) => {
      if (ignoreHead && index == 0) return false;
      return this.equal(seg, pos);
    });
  }

  addSegments() {
    for (let i = 0; i < this.newSegments; i++) {
      this.snakeBody.push({ ...this.snakeBody[this.snakeBody.length - 1] });
    }
    this.newSegments = 0;
  }

  equal(pos1: Pos, pos2: Pos) {
    return (pos1.x === pos2.x && pos1.y === pos2.y);
  }

  checkState() {
    this.gameover = this.outsizeGrid(this.snakeBody[0]) || this.intersect();
  }

  intersect() {
    return this.onSnake(this.snakeBody[0], { ignoreHead: true })
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
