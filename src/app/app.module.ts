import { Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { MyComponent } from './my.component';

@NgModule({
  declarations: [],
  imports: [ BrowserModule ],
  providers: [],
})
export class AppModule { 
  constructor(injector: Injector) {
    const comp = createCustomElement(MyComponent, { injector });
    customElements.define('my-component', comp);
  }
}
