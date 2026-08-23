import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlansService } from '../../../services/plans.service';

@Component({
  selector: 'app-events',
  imports: [FormsModule, CommonModule],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events implements OnInit {
  events: any[] = [];
  showModal = false;

  newEvent = {
    name: '',
    amount: 0,
    event_type: 'income_change', // income_change, expense_change, asset_transfer
    month: 1,
    cash_flow_id: null,
  };

  isEditMode = false;
  editingId: number | null = null;

  cashFlows: any[] = [];

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
    this.plansService.getEvents().subscribe(data => {
      this.events = data;
      this.cdr.detectChanges();
    });
  }

  loadCashFlows() {
    this.plansService.getCashFlows().subscribe(data => {
      this.cashFlows = data;
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (this.isEditMode && this.editingId) {
      this.plansService.updateEvent(this.editingId, this.newEvent).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    } else {
      this.plansService.addEvent(this.newEvent).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    }
  }

  onDelete(id: number) {
    this.plansService.deleteEvent(id).subscribe(() => this.loadData());
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
      cash_flow_id: null
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
