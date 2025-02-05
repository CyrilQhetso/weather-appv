import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { SearchComponent } from "../search/search.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [SearchComponent, CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss'
})
export class WeatherComponent implements OnInit {

  currentWeather: any;
  forecast: any;
  errorMessage: string = '';
  location: any;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
     this.getLocation(); 
  }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => this.getWeatherData(position.coords),
        error => this.errorMessage = 'Please enable location access'
      );
    } else {
      this.errorMessage = 'Geolocaton is not supported by this browser';
    }
  }

  private getWeatherData(coords: GeolocationCoordinates) {
    this.weatherService.getCurrentWeather(coords.latitude, coords.longitude).
    subscribe((data: any) => {
      this.currentWeather = data.current;
      this.location = data.location;
    });

    this.weatherService.getForecast(coords.latitude, coords.longitude).
    subscribe((data: any) => this.processForecast(data.forecast));
  }


  private processForecast(data: any) {
    this.forecast = data.forecastday.slice(0, 3);
  }

  handleSearch(city: string) {
    this.weatherService.getWeatherByCity(city).subscribe({
      next: (data: any) => {
        this.currentWeather = data.current;
        this.location = data.location;
        this.processForecast(data.forecast);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Location not found';
        this.currentWeather = null;
        this.forecast = null;
      }
    });
  }

  getTemperatureClass(temp: number): string {
    if (!temp) return '';
    if (temp < 15) return 'cold-weather';
    if (temp < 20) return 'cool-weather';
    if (temp < 25) return 'warm-weather';
    return 'hot-weather';
  }
}
