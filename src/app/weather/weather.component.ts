import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { SearchComponent } from "../search/search.component";
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [SearchComponent, CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {

  citiesWeather: any[] = [];
  trackedLocations: { id: string; name: string }[] = [];
  currentLocationWeather: any = null;
  errorMessage = '';
  currentTheme = 'day';

  constructor(
    private weatherService: WeatherService,
    private themeService: ThemeService
  ) {
    this.themeService.currentTheme$
      .pipe(takeUntilDestroyed())
      .subscribe(theme => {
        this.currentTheme = theme;
      });
  }

  ngOnInit() {
    this.getLocation();
    const savedLocations = localStorage.getItem('trackedLocations');
    if (savedLocations) {
      this.trackedLocations = JSON.parse(savedLocations);
      this.loadWeatherData();
    }
  }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => this.getCurrentLocationWeather(position.coords),
        error => this.errorMessage = 'Please enable location access'
      );
    }
  }

  private getCurrentLocationWeather(coords: GeolocationCoordinates) {
    this.weatherService.getCurrentWeather(coords.latitude, coords.longitude)
      .subscribe({
        next: (data: any) => {
          this.currentLocationWeather = {
            current: data.current,
            location: data.location,
            forecast: data.forecast
          };
        },
        error: () => this.errorMessage = 'Error fetching current location weather'
      });
  }

  handleSearch(result: any) {
    const uniqueId = `${result.name}-${result.country}`;
    if (!this.trackedLocations.some(loc => loc.id === uniqueId)) {
      this.trackedLocations.push({ id: uniqueId, name: result.name });
      this.loadWeatherData();
      this.saveToLocalStorage();
    }
  }

  private loadWeatherData() {
    if (this.trackedLocations.length === 0) return;

    this.weatherService.getMultipleLocationsWeather(
      this.trackedLocations.map(loc => loc.name)
    ).subscribe({
      next: (responses: any[]) => {
        this.citiesWeather = responses.map(response => ({
          current: response.current,
          location: response.location,
          forecast: response.forecast
        }));
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Error loading weather data';
        console.error(err);
      }
    });
  }

  removeLocation(locationId: string) {
    this.trackedLocations = this.trackedLocations.filter(loc => loc.id !== locationId);
    this.citiesWeather = this.citiesWeather.filter(weather => 
      `${weather.location.name}-${weather.location.country}` !== locationId
    );
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('trackedLocations', JSON.stringify(this.trackedLocations));
  }

  getTemperatureClass(temp: number): string {
    if (!temp) return '';
    if (temp < 15) return 'cold';
    if (temp < 20) return 'cool';
    if (temp < 25) return 'warm';
    return 'hot';
  }
}
