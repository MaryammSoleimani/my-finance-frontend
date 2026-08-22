import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlansService } from '../../../services/plans.service';

@Component({
  selector: 'app-cash-flow',
  imports: [FormsModule,CommonModule],
  templateUrl: './cash-flow.html',
  styleUrl: './cash-flow.css',
})
export class CashFlow implements OnInit{
  cashFlows: any[] = [];
  showModal = false;

  newFlow = {
    name: '',
    amount: 0,
    flow_type: 'in', // inflow or outflow
  };

  isEditMode = false;
  editingId: number | null = null;

  constructor(private plansService: PlansService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.plansService.getCashFlows().subscribe(data => {
      this.cashFlows = data;
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (this.isEditMode && this.editingId) {
      this.plansService.updateCashFlow(this.editingId, this.newFlow).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    } else {
      this.plansService.addCashFlow(this.newFlow).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    }
  }

  onDelete(id: number) {
    this.plansService.deleteCashFlow(id).subscribe(() => this.loadData());
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.editingId = null;
    this.newFlow = { name: '', amount: 0, flow_type: 'in'}
  }

  onEdit(flow: any) {
    this.isEditMode = true;
    this.editingId = flow.id;
    this.newFlow = { ...flow };
    this.showModal = true;
  }


}
