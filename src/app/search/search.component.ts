import { Component, EventEmitter, Output } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  @Output() search = new EventEmitter<string>();
  city = '';
  suggestions: any[] =  [];
  showSuggestions = false;

  constructor(private weatherService: WeatherService) {}

  onInputChange() {
    if (this.city.length > 2) {
      this.weatherService.searchLocation(this.city).subscribe({
        next: (data: any) => {
          this.suggestions = data;
          this.showSuggestions = true;
        },
        error: () => {
          this.suggestions = [];
          this.showSuggestions = false;
        }
      });
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  selectAndAdd(suggestion: any) {
    this.search.emit(suggestion);
    this.showSuggestions = false;
    this.city = '';
  }
}
