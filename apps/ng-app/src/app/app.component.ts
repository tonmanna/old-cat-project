import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'code-cat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-app';
  myForm: FormGroup;
  constructor() {
    this.myForm = new FormGroup({});
  }
  update() {
    console.log('CLICK');
  }
}
