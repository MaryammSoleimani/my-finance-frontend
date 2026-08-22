import { Component, AfterViewInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements AfterViewInit {
  indicatorLeft = 0;
  indicatorWidth = 0;

  constructor(private authService: AuthService, private router: Router) {}

  moveIndicator(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    this.indicatorLeft = element.offsetLeft;
    this.indicatorWidth = element.offsetWidth;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    this.syncIndicator();
  }

  private syncIndicator() {
    setTimeout(() => {
      const activeItem = document.querySelector('.active-item') as HTMLElement;
      if (activeItem) {
        this.indicatorLeft = activeItem.offsetLeft;
        this.indicatorWidth = activeItem.offsetWidth;
      }
    }, 300);
  }

  get isUserLoggedIn(): boolean {
  return this.authService.isLoggedIn();
}
}