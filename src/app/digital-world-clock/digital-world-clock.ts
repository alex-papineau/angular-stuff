import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-digital-world-clock',
  imports: [],
  templateUrl: './digital-world-clock.html',
  styleUrl: './digital-world-clock.css',
})
export class DigitalWorldClock implements OnInit, OnDestroy {

  currentTime = signal(new Date());

  worldClocks = [
    { country: 'New York, USA', zone: 'America/New_York' },
    { country: 'London, UK', zone: 'Europe/London' },
    { country: 'Dubai, UAE', zone: 'Asia/Dubai' },
    { country: 'Tokyo, Japan', zone: 'Asia/Tokyo' },
  ]

  intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  formatTime(zone?: string) {
    return this.currentTime().toLocaleTimeString('en-us', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  formatDate(zone?: string) {
    return this.currentTime().toLocaleDateString('en-us', {
      timeZone: zone,
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }
}
