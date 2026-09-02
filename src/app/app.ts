import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Stopwatch } from './stopwatch/stopwatch';

@Component({
  selector: 'app-root',
  imports: [Stopwatch],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('Angular-Portfolio');
}
