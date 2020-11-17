import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RulesPlayer {
  name: string;
  withoutVowelsName: string;
  image?: string;
  correct: boolean;
}
export interface APIPlayerResponse {
  name: string;
  team: string;
  image: string;
}

export function removeVowels(name: string): string {
  return name.replace(/a|e|i|o|u| /gi, '');
}

@Injectable({
  providedIn: 'root',
})
export class PlayerListService {
  constructor(private http: HttpClient, private toastr: ToastrService) {}
  public sendPlayerName: RulesPlayer[] = new Array<RulesPlayer>();
  public recivePlayerName: RulesPlayer[] = new Array<RulesPlayer>();

  public isStartQuestion(): boolean {
    if (this.sendPlayerName.length == 0 && this.recivePlayerName.length == 0) return true;
    return false;
  }
  public fetchPlayers(playerName: string): Observable<APIPlayerResponse[]> {
    const httpParam = new HttpParams().set('name', playerName);
    return this.http.get<APIPlayerResponse[]>('http://localhost:3000/players', {
      params: httpParam,
    });
  }
  public fetchMatchPlayer(player: RulesPlayer): Observable<string> {
    return this.fetchPlayers(player.name).pipe<string>(
      map((result) => {
        if (result.length > 0) {
          //if (result[0].name.toLocaleLowerCase() == player.name.toLocaleLowerCase()) {
          return result[0].image;
          // }
          // this.toastr.warning(`Not found Player name ${player.name}`, 'Not found.');
          // return '404';
        } else {
          return '404';
        }
      })
    );
  }
  public checkWIthLastPlayerName(player: RulesPlayer): boolean {
    if (this.sendPlayerName.length > 0) {
      const currentPlayer = this.sendPlayerName[this.sendPlayerName.length - 1].withoutVowelsName;
      for (let i = 0; i < currentPlayer.length; i++) {
        if (player.withoutVowelsName.includes(currentPlayer.charAt(i))) return true;
      }
    }
    return false;
  }
}
