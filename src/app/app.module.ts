import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MyComponent } from './my.component';
import { ElemComponent } from './elem.component';

@NgModule({
  declarations: [MyComponent, ElemComponent],
  imports: [ BrowserModule ],
  providers: [],
  bootstrap: [MyComponent]
})
export class AppModule { 
}
