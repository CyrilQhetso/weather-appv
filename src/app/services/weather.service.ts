import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiKey = environment.weatheraApiKey;
  private apiUrl = environment.weatherApiUrl;
  
  constructor(private http: HttpClient) { }

  getCurrentWeather(latitude: number, longitude: number) {
    return this.http.get(`${this.apiUrl}/current.json?key=${this.apiKey}&q=${latitude},${longitude}`);
  }

  getForecast(latitude: number, longitude: number) {
    return this.http.get(`${this.apiUrl}/forecast.json?key=${this.apiKey}&q=${latitude},${longitude}&days=3`);
  }

  searchLocation(query: string) {
    return this.http.get(`${this.apiUrl}/search.json?key=${this.apiKey}&q=${query}`);
  }

  getWeatherByCity(city: string) {
    return this.http.get(`${this.apiUrl}/forecast.json?key=${this.apiKey}&q=${city}&days=3`);
  }
}
