import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';

@Component({
  selector: 'app-add-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-budget.html',
  styleUrl: './add-budget.css'
})
export class AddBudget implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  name: string = '';
  amount: number = 0;
  resetPeriod: string = 'monthly';
  categoryId: number | null = null;
  categories: any[] = [];

  private budgetService = inject(BudgetService);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.budgetService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  save() {
    const budgetData = {
      name: this.name,
      amount: this.amount,
      reset_period: this.resetPeriod,
      category: this.categoryId
    };

    this.budgetService.createBudget(budgetData).subscribe({
      next: () => {
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => console.error('Error creating budget:', err)
    });
  }
}
