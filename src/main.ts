import 'zone.js';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { MyComponent } from './app/my.component';
import { environment } from './environments/environment';

environment.production && enableProdMode();

bootstrapApplication(MyComponent)
