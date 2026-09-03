import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { AddBudget } from './add-budget/add-budget';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, AddBudget],
  templateUrl: './budget.html',
  styleUrl: './budget.css'
})
export class Budget implements OnInit {

  budgets: any[] = [];
  summary: any = null;

  showAddBudget = false;
  period = 'monthly';

  constructor(private budgetService: BudgetService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('🔥 BUDGET INIT');
    this.loadData();
  }

  private loadData(): void {
    this.loadBudgets();
    this.loadSummary();
  }

  private loadBudgets(): void {
     console.log('🔥 GETTING BUDGETS');
    this.budgetService.getBudgets().subscribe({
      next: (data) => {
        console.log('🔥 BUDGET RESPONSE:', data);
        console.log('🔥 IS ARRAY:', Array.isArray(data));
        this.budgets = data;
        this.cdr.detectChanges();
        console.log('🔥 BUDGETS LENGTH:', this.budgets.length);
      },
      error: (err) => {
        console.error('🔥 BUDGET ERROR:', err);
        console.error('Error loading budgets:', err);
      }
    });
  }

  private loadSummary(): void {
    this.budgetService.getSummary(this.period).subscribe({
      next: (data) => {
        this.summary = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading budget summary:', err);
      }
    });
  }

  setPeriod(period: string): void {
    if (this.period === period) {
      return;
    }

    this.period = period;
    this.loadSummary();
  }

  onAddBudget(): void {
    this.showAddBudget = true;
  }

  onCloseAddBudget(): void {
    this.showAddBudget = false;
  }

  onBudgetSaved(): void {
    this.showAddBudget = false;

    // Refresh both cards and summary immediately
    this.loadData();
  }

  getProgressColor(percentage: number): string {
    if (percentage < 50) return '#10b981';
    if (percentage < 80) return '#f59e0b';
    if (percentage < 100) return '#f97316';
    return '#ef4444';
  }
}
