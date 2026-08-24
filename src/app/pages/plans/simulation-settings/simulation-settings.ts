import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlansService } from '../../../services/plans.service';

@Component({
  selector: 'app-simulation-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulation-settings.html',
  styleUrl: './simulation-settings.css'
})
export class SimulationSettings implements OnInit {
  private plansService = inject(PlansService);

  private settingsSignal = signal<any>({
    start_date: '',
    end_date: '',
    initial_cash: 0,
    monthly_expenses: 0,
    monthly_income: 0
  });

  private showSettingsSignal = signal<boolean>(false);

  readonly settings = computed(() => this.settingsSignal());
  readonly showSettings = computed(() => this.showSettingsSignal());

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.plansService.getSimulationSettings().subscribe({
      next: (data) => {
        this.settingsSignal.set(data || {});
      },
      error: (err) => console.error('Error loading settings:', err)
    });
  }

  openSettings() {
    this.showSettingsSignal.set(true);
  }

  closeSettings() {
    this.showSettingsSignal.set(false);
  }

  saveSettings() {
    this.plansService.updateSimulationSettings(this.settings()).subscribe({
      next: () => {
        this.closeSettings();
        this.loadSettings();
      },
      error: (err) => console.error('Error saving settings:', err)
    });
  }
}
