import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NoopAnimationsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, HttpClientModule, ToastrModule.forRoot(), MatAutocompleteModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
