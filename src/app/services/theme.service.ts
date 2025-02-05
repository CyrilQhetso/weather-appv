import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme: 'light' | 'dark' = 'light' ;

  constructor() { 
    this.setAutoTheme();
  }

  private setAutoTheme() {
    const hours = new Date().getHours();
    this.currentTheme = (hours > 18 || hours < 6 ) ? 'dark' : 'light';
    document.body.className = this.currentTheme;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = this.currentTheme;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}
