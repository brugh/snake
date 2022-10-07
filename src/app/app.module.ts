import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { MyComponent } from './my.component';
import { SnakeComponent } from './snake.component';

@NgModule({
  declarations: [MyComponent, SnakeComponent],
  imports: [ BrowserModule ],
  providers: [],
  bootstrap: [MyComponent]
})
export class AppModule { 
}
