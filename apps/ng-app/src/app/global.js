import { BehaviorSubject } from 'rxjs';

export const sendToNG$ = new BehaviorSubject();

export function sendToNG(value) {
  sendToNG$.next(value);
}

let elmApp = null;

export function storeElmApp(app) {
  elmApp = app;
}

export function sendToElm(value) {
  elmApp.ports.ngValueReceived.send(value.playerName);
}
