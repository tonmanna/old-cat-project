import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { sendToNG$, sendToElm } from './global';
import { PlayerListService, RulesPlayer, removeVowels } from './player.service';
@Component({
  selector: 'code-cat-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  myForm: FormGroup;
  destroy$ = new Subject();
  playerList$ = new Observable<RulesPlayer[]>();
  constructor(
    private playerListService: PlayerListService,
    private _cdr: ChangeDetectorRef
  ) {
    this.myForm = new FormGroup({});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    sendToNG$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        const player = {
          name: value,
          withoutVowelsName: removeVowels(value),
        } as RulesPlayer;
        if (!this.playerListService.isStartQuestion()) {
          this.playerListService.checkWIthLastPlayerName(player)
            ? (player.correct = true)
            : (player.correct = false);
          console.log();
        }
        this.playerListService.recivePlayerName.push(player);
        this.playerList$ = of(this.playerListService.recivePlayerName);
        this._cdr.detectChanges();
      }
    });
    this.myForm = new FormGroup({
      playerName: new FormControl('', [Validators.required]),
    });
  }
  update() {
    if (this.myForm.valid) {
      sendToElm(this.myForm.value);
    }
  }
}
