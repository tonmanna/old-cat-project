import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
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
  constructor(private playerListService: PlayerListService, private _cdr: ChangeDetectorRef, private toastr: ToastrService) {
    this.myForm = new FormGroup({
      playerName: new FormControl('', [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    sendToNG$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((value: string) => {
          const player = {
            name: value,
            withoutVowelsName: removeVowels(value),
            image: '',
            guess: '',
          } as RulesPlayer;
          return this.playerListService.fetchMatchPlayer(player).pipe(
            map((person) => {
              if (Object.keys(person).length > 0) {
                player.guess = person.name;
                player.image = person.image;
              }
              return { ...player } as RulesPlayer;
            })
          );
        })
      )
      .subscribe((player: RulesPlayer) => {
        if (!this.playerListService.isStartQuestion()) {
          this.playerListService.checkWIthLastPlayerName(player) ? (player.correct = true) : (player.correct = false);
        }
        if (!player.guess) player.correct = false;
        this.playerListService.recivePlayerName.push(player);
        this.playerList$ = of(this.playerListService.recivePlayerName);
        this._cdr.detectChanges();
      });
    this.myForm = new FormGroup({
      playerName: new FormControl('', [Validators.required]),
    });
  }
  update() {
    if (this.myForm.valid) {
      const player = {
        name: this.myForm.value.playerName,
        withoutVowelsName: removeVowels(this.myForm.value.playerName),
      } as RulesPlayer;
      this.playerListService.sendPlayerName.push(player);
      sendToElm(this.myForm.value);
    } else {
      this.toastr.warning('Player name are require.', 'Require field');
    }
  }
}
