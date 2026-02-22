import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Timezone } from './components/timezone/timezone';
import { Exchange } from './components/exchange/exchange';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Timezone, Exchange],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('expatflow');
}
