import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Stopwatch } from './stopwatch/stopwatch';
import { Quiz } from './quiz/quiz';

@Component({
  selector: 'app-root',
  imports: [Stopwatch, Quiz],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('Angular-Portfolio');
}
