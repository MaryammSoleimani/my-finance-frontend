import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansService } from '../../../services/plans.service';

@Component({
  selector: 'app-simulation-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simulation-steps.html',
  styleUrl: './simulation-steps.css'
})
export class SimulationSteps implements OnInit {
  private plansService = inject(PlansService);

  steps: any[] = [];
  showAll = false;

  ngOnInit() {
    this.loadSteps();
  }

  loadSteps() {
    this.plansService.getSimulationSteps().subscribe({
      next: (data) => {
        this.steps = data;
      },
      error: (err) => console.error('Error loading steps:', err)
    });
  }

  // این یک property است، نه method
  get displayedSteps(): any[] {
    return this.showAll ? this.steps : this.steps.slice(0, 5);
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }
}
