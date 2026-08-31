import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit {

  // =========================
  // Health Score
  // =========================

  healthScore: any = null;
  healthScoreLoading = false;

  // =========================
  // Anomaly Alerts
  // =========================

  anomalyAlerts: any[] = [];

  // =========================
  // Smart Goal
  // =========================

  smartGoal: any = null;

  goalAmount = 0;
  goalMonths = 12;

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================
  // Initialization
  // =========================

  ngOnInit(): void {
    this.loadAnomalyAlerts();
  }

  // =========================
  // Health Score
  // =========================

  loadHealthScore(): void {

    // Reset previous result
    this.healthScore = null;
    this.healthScoreLoading = true;

    console.log('Loading health score...');

    this.analyticsService.getHealthScore().subscribe({

      next: (data) => {

        console.log('Health Score Response:', data);

        // Store response
        this.healthScore = data;

        // Stop loading
        this.healthScoreLoading = false;

        console.log('Health Score State:', this.healthScore);
        console.log('Loading State:', this.healthScoreLoading);

        /*
         * Force Angular to update the UI immediately.
         * This is especially useful when the application
         * is using optimized / zoneless change detection.
         */
        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error('Health Score Error:', err);

        this.healthScore = null;
        this.healthScoreLoading = false;

        this.cdr.detectChanges();
      }

    });
  }

  // =========================
  // Anomaly Alerts
  // =========================

  loadAnomalyAlerts(): void {

    this.analyticsService.getAnomalyAlerts().subscribe({

      next: (data) => {

        console.log('Anomaly Alerts:', data);

        this.anomalyAlerts = data?.alerts ?? [];

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error('Anomaly Alerts Error:', err);

        this.anomalyAlerts = [];

        this.cdr.detectChanges();
      }

    });
  }

  // =========================
  // Smart Goal
  // =========================


calculateGoal(): void {

  console.log('1 - Button clicked');

  console.time('smart-goal');

  this.analyticsService
    .calculateSmartGoal(this.goalAmount, this.goalMonths)
    .subscribe({

      next: (data) => {

        console.log('2 - Response received:', data);

        this.smartGoal = data;

        console.log('3 - smartGoal assigned:', this.smartGoal);

        console.timeEnd('smart-goal');
      },

      error: (err) => {

        console.error('Smart Goal Error:', err);

        console.timeEnd('smart-goal');
      }
    });
}



  // =========================
  // Score Color
  // =========================

  getScoreColor(score: number): string {

    if (score >= 90) {
      return '#10b981';
    }

    if (score >= 75) {
      return '#3b82f6';
    }

    if (score >= 60) {
      return '#f59e0b';
    }

    if (score >= 40) {
      return '#f97316';
    }

    return '#ef4444';
  }

  // =========================
  // Status Icon
  // =========================

  getStatusIcon(status: string): string {

    switch (status) {

      case 'good':
        return '✅';

      case 'ok':
        return '👍';

      case 'warning':
        return '⚠️';

      case 'danger':
        return '❌';

      default:
        return '➖';
    }
  }

  // =========================
  // Status Color
  // =========================

  getStatusColor(status: string): string {

    switch (status) {

      case 'good':
        return '#10b981';

      case 'ok':
        return '#3b82f6';

      case 'warning':
        return '#f59e0b';

      case 'danger':
        return '#ef4444';

      default:
        return '#71717a';
    }
  }

  getRiskIcon(status: string): string {
  switch (status) {
    case 'good':
      return '✅';

    case 'ok':
      return '👍';

    case 'warning':
      return '⚠️';

    case 'danger':
      return '🚨';

    default:
      return '💡';
  }
}

getRiskTitle(level: string): string {
  switch (level) {
    case 'low':
      return 'Goal Looks Comfortable';

    case 'reasonable':
      return 'Goal Looks Reasonable';

    case 'challenging':
      return 'Goal May Be Challenging';

    case 'high':
      return 'Goal Is High Risk';

    default:
      return 'Goal Analysis';
  }
}

  formatLabel(key: string | number | symbol): string {

    return String(key)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
