import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-traffic-signal',
  imports: [],
  templateUrl: './traffic-signal.html',
  styleUrl: './traffic-signal.css',
})
export class TrafficSignal {
  lights = [
    { color: 'Red', duration: 5 },
    { color: 'Yellow', duration: 2 },
    { color: 'Green', duration: 4 }
  ]

  currentIndex = signal(0);
  currentLight = signal(this.lights[0].color);
  timer = signal(this.lights[0].duration);

  intervalId: any;

  constructor() {
    this.startTrafficLight();
  }

  startTrafficLight() {
    this.intervalId = setInterval(() => {
      this.timer.update(value => value - 1);

      if (this.timer() === 0) {
        let nextIndex = 0;
        if (this.currentIndex() === 0) {
            nextIndex = 2; // Red to Green
        } else if (this.currentIndex() === 2) {
            nextIndex = 1; // Green to Yellow
        } else {
            nextIndex = 0; // Yellow to Red
        }
        
        this.currentIndex.set(nextIndex);
        this.currentLight.set(this.lights[nextIndex].color);
        this.timer.set(this.lights[nextIndex].duration);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
