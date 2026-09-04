import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  imports: [],
  templateUrl: './stopwatch.html',
  styleUrl: './stopwatch.css',
})
export class Stopwatch {
  time = signal(0);
  interval : any;
  private startTime = 0;

  formattedTime = computed(() => {
    const ms = this.time();
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  });

  start() {
    if (this.interval) return;
    this.startTime = Date.now() - this.time();
    this.interval = setInterval(() => {
      this.time.set(Date.now() - this.startTime);
    }, 10);
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }

  reset() {
    this.stop();
    this.time.set(0);
  }
}
