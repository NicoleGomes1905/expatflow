import { Component, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-timezone',
  imports: [FormsModule],
  templateUrl: './timezone.html',
  styleUrl: './timezone.css',
})
export class Timezone {

  timer: any;
  timezoneBrasilia = signal('');
  timezone1 = signal('');
  timezone2 = signal('');
  weekdayTimezone1 = signal('');
  weekdayTimezone2 = signal('');
  hourLisbonPointer = signal('');
  hourBrasiliaPointer = signal('');
  minuteLisbonPointer = signal('');
  minuteBrasiliaPointer = signal('');

  timezones = signal([
    { city: 'Lisbon, Portugal', zone: 'Europe/Lisbon' },
    { city: 'Brasília, Brazil', zone: 'America/Sao_Paulo' },
    { city: 'New York, US', zone: 'America/New_York' },
    { city: 'London, UK', zone: 'Europe/London' },
    { city: 'Tokyo, Japan', zone: 'Asia/Tokyo' },
    { city: 'Sydney, Australia', zone: 'Australia/Sydney' },
    { city: 'Hong Kong, China', zone: 'Asia/Hong_Kong' },
    { city: 'Dubai, UAE', zone: 'Asia/Dubai' }
  ]);

  selectedTimezone1 = signal(this.timezones()[0].zone);
  selectedTimezone2 = signal(this.timezones()[1].zone);

  constructor() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {

    this.timezone1.set(this.getTimezone(this.selectedTimezone1()));
    this.timezone2.set(this.getTimezone(this.selectedTimezone2()));

    const weekdayOptions: Intl.DateTimeFormatOptions = { weekday: 'short' };
    this.weekdayTimezone1.set(new Date().toLocaleString('en-US', {timeZone: this.selectedTimezone1(), ...weekdayOptions}));
    this.weekdayTimezone2.set(new Date().toLocaleString('en-US', {timeZone: this.selectedTimezone2(), ...weekdayOptions}));
    
    this.weekdayTimezone1.set(this.weekdayTimezone1().toUpperCase());
    this.weekdayTimezone2.set(this.weekdayTimezone2().toUpperCase());

    this.hourLisbonPointer.set('rotate(' + this.calculateClockData(this.timezone1()).degreeHours + 'deg)');
    this.hourBrasiliaPointer.set('rotate(' + this.calculateClockData(this.timezone2()).degreeHours + 'deg)');
    this.minuteLisbonPointer.set('rotate(' + this.calculateClockData(this.timezone1()).degreeMinutes + 'deg)');
    this.minuteBrasiliaPointer.set('rotate(' + this.calculateClockData(this.timezone2()).degreeMinutes + 'deg)');

  }

  getTimezone(timezone: string) {
    return new Date().toLocaleString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
  }

  calculateClockData(timezone: string) {
    const parts = timezone.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    const degreeHours = (hours % 12) * 30;
    const degreeMinutes = (minutes / 60) * 360;

    return {
      degreeHours,
      degreeMinutes
    };
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

}
