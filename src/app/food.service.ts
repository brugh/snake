import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EXPAND, GRID, Pos } from './my.models';
import { SnakeService } from './snake.service';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private _foodPos = new BehaviorSubject<Pos>(this.newPos());
  public readonly foodPos$: Observable<Pos> = this._foodPos.asObservable();

  constructor(private snake: SnakeService) { }

  update() {
    if (this.snake.onSnake(this._foodPos.value)) {
      this.snake.newSegments = EXPAND;
      this._foodPos.next(this.newPos());
    }
  }

  newPos() {
    const rnd = (nr: number) => ({ x: Math.floor(Math.random() * nr + 1), y: Math.floor(Math.random() * nr + 1) });
    let p: Pos;
    do { p = rnd(GRID); } while (this.snake.onSnake(p));
    return p;
  }

}
