// src/app/pages/plans/cash-flow/cash-flow.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlansService } from '../../../services/plans.service';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cash-flow.html',
  styleUrl: './cash-flow.css',
})
export class CashFlow implements OnInit {
  cashFlows: any[] = [];
  showModal = false;

  newFlow = {
    name: '',
    amount: 0,
    flow_type: 'in',
    frequency: 'monthly'
  };

  isEditMode = false;
  editingId: number | null = null;

  constructor(private plansService: PlansService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
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
      this.plansService.updateCashFlow(this.editingId, this.newFlow).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error updating cash flow:', err)
      });
    } else {
      this.plansService.addCashFlow(this.newFlow).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error adding cash flow:', err)
      });
    }
  }

  onDelete(id: number) {
    this.plansService.deleteCashFlow(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error deleting cash flow:', err)
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.editingId = null;
    this.newFlow = { name: '', amount: 0, flow_type: 'in', frequency: 'monthly' };
  }

  onEdit(flow: any) {
    this.isEditMode = true;
    this.editingId = flow.id;
    this.newFlow = { ...flow };
    this.showModal = true;
  }
}
