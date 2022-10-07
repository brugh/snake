import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EXPAND, Pos } from './my.models';
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

  newPos(): Pos {
    const rnd = () => ({ x: Math.floor(Math.random() * 21 + 1), y: Math.floor(Math.random() * 21 + 1) });
    let p: Pos;
    do { p = rnd(); } while (this.snake.onSnake(p));
    return p;
  }

}
