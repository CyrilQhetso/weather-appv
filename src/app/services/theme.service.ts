import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<'dawn' | 'day' | 'dusk' | 'night'>('day');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.setAutoTheme();
    setInterval(() => this.setAutoTheme(), 1000 * 60);
  }

  private setAutoTheme() {
    const hours = new Date().getHours();
    let newTheme: 'dawn' | 'day' | 'dusk' | 'night';

    if (hours >= 5 && hours < 9) {
      newTheme = 'dawn';
    } else if (hours >= 9 && hours < 17) {
      newTheme = 'day';
    } else if (hours >= 17 && hours < 20) {
      newTheme = 'dusk';
    } else {
      newTheme = 'night';
    }

    if (newTheme !== this.currentThemeSubject.value) {
      this.currentThemeSubject.next(newTheme);
      this.applyThemeToBody(newTheme);
    }
  }

  private applyThemeToBody(theme: string) {
    document.body.className = theme;
  }

  getCurrentTheme() {
    return this.currentThemeSubject.value;
  }
}