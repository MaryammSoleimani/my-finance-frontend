// src/app/pages/plans/simulation-summary/simulation-summary.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansService } from '../../../services/plans.service';

@Component({
  selector: 'app-simulation-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulation-summary.html',
  styleUrl: './simulation-summary.css'
})
export class SimulationSummary implements OnInit {
  private plansService = inject(PlansService);

  summary: any = {
    final_total_assets: 0,
    final_liquid_assets: 0,
    plan_outcome: 'pending'
  };

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.plansService.getSimulationSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => console.error('Error loading summary:', err)
    });
  }
}
