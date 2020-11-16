import { Injectable } from '@angular/core';

export interface RulesPlayer {
  name: string;
  withoutVowelsName: string;
  correct: boolean;
}

export function removeVowels(name: string): string {
  name = name
    .replace(/a/gi, '')
    .replace(/e/gi, '')
    .replace(/i/gi, '')
    .replace(/o/gi, '')
    .replace(/u/gi, '');
  return name;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerListService {
  public sendPlayerName: RulesPlayer[] = new Array<RulesPlayer>();
  public recivePlayerName: RulesPlayer[] = new Array<RulesPlayer>();
  public isStartQuestion(): boolean {
    if (this.sendPlayerName.length == 0 && this.recivePlayerName.length == 0)
      return true;
    return false;
  }
  public checkWIthLastPlayerName(player: RulesPlayer): boolean {
    if (this.sendPlayerName.length > 0) {
      const currentPlayer = this.sendPlayerName[this.sendPlayerName.length - 1]
        .withoutVowelsName;
      for (let i = 0; i < currentPlayer.length; i++) {
        if (currentPlayer.charAt(i).includes(player.withoutVowelsName))
          return true;
      }
    }
    return false;
  }
}
