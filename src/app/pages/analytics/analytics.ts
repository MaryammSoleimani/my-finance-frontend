import { Component, OnInit } from '@angular/core';
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
  healthScore: any = null;
  anomalyAlerts: any[] = [];
  smartGoal: any = null;

  goalAmount: number = 0;
  goalMonths: number = 12;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadHealthScore();
    this.loadAnomalyAlerts();
  }

  loadHealthScore() {
    this.analyticsService.getHealthScore().subscribe({
      next: (data) => this.healthScore = data,
      error: (err) => console.error(err)
    });
  }

  loadAnomalyAlerts() {
    this.analyticsService.getAnomalyAlerts().subscribe({
      next: (data) => this.anomalyAlerts = data.alerts,
      error: (err) => console.error(err)
    });
  }

  calculateGoal() {
    this.analyticsService.calculateSmartGoal(this.goalAmount, this.goalMonths).subscribe({
      next: (data) => this.smartGoal = data,
      error: (err) => console.error(err)
    });
  }

  getScoreColor(score: number): string {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#3b82f6';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  }
}
