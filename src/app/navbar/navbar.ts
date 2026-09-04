
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements AfterViewInit, OnInit {
  indicatorLeft = 0;
  indicatorWidth = 0;
  unreadCount: number = 0;
  notifications: any[] = [];
  showNotifications: boolean = false;
  constructor(private authService: AuthService,
              private router: Router, private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => this.syncIndicator(), 100);
    });
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.is_read).length;
      },
      error: (err) => console.error(err)
    });
  }
   toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => this.loadNotifications(),
      error: (err) => console.error(err)
    });
  }

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
