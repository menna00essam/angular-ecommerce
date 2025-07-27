import { RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/components/navbar/navbar";
import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';
import { LanguageService } from './core/services/language.service';
import { Footer } from "./shared/components/footer/footer";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})


export class App implements OnInit {
    protected title = 'ecommerce-app';

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.themeService.setTheme(this.themeService.currentTheme());
    this.languageService.switchLanguage(this.languageService.currentLanguage());
  }
}