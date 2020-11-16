import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { sendToNG$, sendToElm } from './global';
@Component({
  selector: 'code-cat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ng-app';
  myForm: FormGroup;
  destroy$ = new Subject();
  constructor() {
    this.myForm = new FormGroup({});
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    sendToNG$.pipe(takeUntil(this.destroy$)).subscribe((value)=>{
      console.log("VALUE:", value);
    })
    this.myForm = new FormGroup({
      playerName: new FormControl('', [Validators.required])
    });
  }
  update() {
    if(this.myForm.valid){
      console.log(this.myForm.value);
      sendToElm(this.myForm.value);
    }
  }
}
