import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from './global';
@Component({
  selector: 'code-cat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng-app';
  myForm: FormGroup;
  constructor() {
    this.myForm = new FormGroup({});
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      // postcode: new FormControl('', [
      //   Validators.required,
      //   Validators.minLength(4),
      // ]),
      // district: new FormControl('', [Validators.required]),
      // city: new FormControl('', [Validators.required]),
      // privince: new FormControl('', [Validators.required]),
      // address: new FormControl('', [Validators.required]),
    });
  }
  update() {
    console.log('this.myForm.value: ', this.myForm.value);
    if (this.myForm.valid) {
      GlobalConstants.address = this.myForm.value;
      console.log('GlobalConstants.address: ', GlobalConstants.address);
    } else {
      console.log('Not valid');
    }
  }
}
