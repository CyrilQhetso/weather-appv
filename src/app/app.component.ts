import { Component } from '@angular/core';
import { WeatherComponent } from './weather/weather.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    WeatherComponent
  ],
  template: `
    <main>
      <app-weather></app-weather>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
      padding: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'weather-appv';
}
