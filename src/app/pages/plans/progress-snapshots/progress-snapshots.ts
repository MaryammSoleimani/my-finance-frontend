import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansService } from '../../../services/plans.service';

interface Snapshot {
  id: number;
  date: string;
  total_assets: number;
  net_worth: number;
}

@Component({
  selector: 'app-progress-snapshots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-snapshots.html',
  styleUrl: './progress-snapshots.css'
})
export class ProgressSnapshots implements OnInit {
  private plansService = inject(PlansService);

  private snapshotsSignal = signal<Snapshot[]>([]);
  private loadingSignal = signal<boolean>(false);

  readonly snapshots = computed(() => this.snapshotsSignal());
  readonly loading = computed(() => this.loadingSignal());

  ngOnInit() {
    this.loadSnapshots();
  }

  loadSnapshots() {
    this.loadingSignal.set(true);
    this.plansService.getSnapshots().subscribe({
      next: (data) => {
        this.snapshotsSignal.set(data || []);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error loading snapshots:', err);
        this.loadingSignal.set(false);
      }
    });
  }

  takeSnapshot() {
    this.plansService.takeSnapshot().subscribe({
      next: () => {
        this.loadSnapshots();
      },
      error: (err) => console.error('Error taking snapshot:', err)
    });
  }

  deleteSnapshot(id: number) {
    this.plansService.deleteSnapshot(id).subscribe({
      next: () => this.loadSnapshots(),
      error: (err) => console.error('Error deleting snapshot:', err)
    });
  }
}
