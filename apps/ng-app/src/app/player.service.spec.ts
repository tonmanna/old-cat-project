import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injector, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Overlay, ToastrService, ToastToken } from 'ngx-toastr';
import { removeVowels, PlayerListService, RulesPlayer } from './player.service';

describe('test', () => {
  const httpClient: HttpClient = new HttpClient({} as HttpHandler);
  const toastr: ToastrService = new ToastrService(
    {} as ToastToken,
    {} as Overlay,
    {} as Injector,
    {} as DomSanitizer,
    {} as NgZone
  );
  let playerService: PlayerListService;
  beforeEach(() => {
    playerService = new PlayerListService(httpClient, toastr);
  });
  test('removeVowels Should be run correct', () => {
    const result = removeVowels('Mohamed Salah');
    expect(result).toEqual('MhmdSlh');
  });

  test('checkRecive correct ', () => {
    const playerSend = {
      name: 'Robbie Kean',
      withoutVowelsName: removeVowels('Robbie Kean'),
    } as RulesPlayer;
    const playerName = 'Robbie Foller';
    const playerRecive = {
      name: playerName,
      withoutVowelsName: removeVowels(playerName),
    } as RulesPlayer;
    playerService.sendPlayerName.push(playerSend);
    const result = playerService.checkWIthLastPlayerName(playerRecive);
    expect(result).toEqual(true);
  });

  test('checkRecive not correct ', () => {
    const playerSend = {
      name: 'Robbie Kean',
      withoutVowelsName: removeVowels('Robbie Kean'),
    } as RulesPlayer;
    const playerName = 'Mohamed Salah';
    const playerRecive = {
      name: playerName,
      withoutVowelsName: removeVowels(playerName),
    } as RulesPlayer;
    playerService.sendPlayerName.push(playerSend);
    const result = playerService.checkWIthLastPlayerName(playerRecive);
    expect(result).toEqual(false);
  });
});
