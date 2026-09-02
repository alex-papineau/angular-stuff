import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  imports: [],
  templateUrl: './stopwatch.html',
  styleUrl: './stopwatch.css',
})
export class Stopwatch {
  time = signal(0);
  interval : any;

  start() {
    this.interval = setInterval(() => {
      this.time.update(v => v + 1);
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }

  reset() {
    this.time.set(0);
  }
}
