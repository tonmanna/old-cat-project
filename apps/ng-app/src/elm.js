import { Elm } from './elm/Main.elm';
import { sendToNG, storeElmApp } from './app/global';

const app = Elm.Main.init({
  node: document.querySelector('elm-root'),
});

storeElmApp(app);

sendToNG('Hello from Elm');
