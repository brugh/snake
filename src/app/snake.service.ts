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

  bodyLength = () => this._snakeBody.value.length;
  snakeHead = () => this._snakeBody.value[0];
  equal = (pos1: Pos, pos2: Pos) => (pos1.x === pos2.x && pos1.y === pos2.y);
  intersect = () => this.onSnake(this._snakeBody.value[0], { ignoreHead: true });

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

  onSnake(pos: Pos, { ignoreHead = false } = {}) {
    return this._snakeBody.value.some((seg: Pos, index: number) => {
      if (ignoreHead && index == 0) return false;
      return this.equal(seg, pos);
    });
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
