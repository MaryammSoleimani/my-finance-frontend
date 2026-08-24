// src/app/pages/plans/events/events.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlansService } from '../../../services/plans.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit {
  events: any[] = [];
  cashFlows: any[] = [];
  showModal = false;

  newEvent = {
    name: '',
    amount: 0,
    event_type: 'income_change',
    month: 1,
    cash_flow_id: null as number | null,
    description: ''
  };

  isEditMode = false;
  editingId: number | null = null;

  eventTypes = [
    { value: 'income_change', label: 'Income Change' },
    { value: 'expense_change', label: 'Expense Change' },
    { value: 'asset_transfer', label: 'Asset Transfer' }
  ];

  constructor(private plansService: PlansService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
    this.loadCashFlows();
  }

  loadData() {
    this.plansService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading events:', err)
    });
  }

  loadCashFlows() {
    this.plansService.getCashFlows().subscribe({
      next: (data) => {
        this.cashFlows = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading cash flows:', err)
    });
  }

  onSubmit() {
    if (this.isEditMode && this.editingId) {
      this.plansService.updateEvent(this.editingId, this.newEvent).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error updating event:', err)
      });
    } else {
      this.plansService.addEvent(this.newEvent).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error adding event:', err)
      });
    }
  }

  onDelete(id: number) {
    this.plansService.deleteEvent(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error deleting event:', err)
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.editingId = null;
    this.newEvent = {
      name: '',
      amount: 0,
      event_type: 'income_change',
      month: 1,
      cash_flow_id: null,
      description: ''
    };
  }

  onEdit(event: any) {
    this.isEditMode = true;
    this.editingId = event.id;
    this.newEvent = { ...event };
    this.showModal = true;
  }

  getEventTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'income_change': 'Income Change',
      'expense_change': 'Expense Change',
      'asset_transfer': 'Asset Transfer'
    };
    return types[type] || type;
  }
}
