import { enableProdMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { Hello2Component } from './hello2.component';
import { UserComponent } from './user.component';

// enableProdMode();
@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, HelloComponent, UserComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
