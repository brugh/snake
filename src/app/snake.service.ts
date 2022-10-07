import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GRID, Pos } from './my.models';

@Injectable({
  providedIn: 'root'
})
export class SnakeService {

  private _snakeBody = new BehaviorSubject<Pos[]>([{ x: Math.round(GRID / 2), y: Math.round(GRID / 2) }]);
  public readonly snakeBody$: Observable<Pos[]> = this._snakeBody.asObservable();
  public newSegments = 0;

  constructor() { }

  bodyLength() {
    return this._snakeBody.value.length;
  }

  snakeHead() {
    return this._snakeBody.value[0];
  }

  update(direction: Pos) {
    this.addSegments();
    const head = { ...this.snakeHead() };
    const body: Pos[] = [
      { x: head.x + direction.x, y: head.y + direction.y },
      ...this._snakeBody.value
    ];
    body.pop();
    this._snakeBody.next(body);
  }

  equal(pos1: Pos, pos2: Pos) {
    return (pos1.x === pos2.x && pos1.y === pos2.y);
  }

  onSnake(pos: Pos, { ignoreHead = false } = {}) {
    return this._snakeBody.value.some((seg: Pos, index: number) => {
      if (ignoreHead && index == 0) return false;
      return this.equal(seg, pos);
    });
  }

  intersect() {
    return this.onSnake(this._snakeBody.value[0], { ignoreHead: true })
  }

  addSegments() {
    const body = [...this._snakeBody.value];
    for (let i = 0; i < this.newSegments; i++) {
      body.push(body[body.length - 1]);
    }
    this._snakeBody.next(body);
    this.newSegments = 0;
  }

}
