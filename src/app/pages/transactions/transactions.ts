import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TransactionSidebar } from "./transaction-sidebar/transaction-sidebar";
import { DonutChart } from './charts/donut-chart/donut-chart';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { BarChart } from './charts/bar-chart/bar-chart';
import { TransactionTable } from './transaction-table/transaction-table';
import { BudgetService } from '../../services/budget.service'; 

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TransactionSidebar, DonutChart, CommonModule, BarChart, TransactionTable],
  providers: [TransactionService],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit, AfterViewInit {
  chartData: number[] = [];
  chartLabels: string[] = [];
  chartColors: string[] = [];
  barData: number[] = [];
  barLabels: string[] = [];

  groupedTransactions: any[] = [];
  totalExpense: number = 0;
  totalDeposit: number = 0;
  activeView: string = 'current-week';

  budgetData: any[] = [];
  viewMode: 'transactions' | 'budget' = 'transactions';
  activeCategory: string = '';

  constructor(
    private transactionService: TransactionService,
    private budgetService: BudgetService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.activeView = 'current-week'; 
      this.onFilterUpdate('current-week'); 
    }, 50);
  }

  loadData() {
    this.transactionService.getCategoryExpenses().subscribe({
      next: (data) => {
        if (data) {
          this.chartData = [...data.series];
          this.chartLabels = [...data.labels];
          this.chartColors = [...data.colors];
          this.cdr.detectChanges(); 
        }
      },
      error: (err) => console.error('Error:', err)
    });

    this.transactionService.getDailyExpenses().subscribe({
      next: (data) => {
        if (data) {
          this.barData = [...data.data];
          this.barLabels = [...data.categories];
          this.cdr.detectChanges();
        }
      }
    });
  }

  loadTableData() {
    this.transactionService.getGroupedTransactions().subscribe({
      next: (res) => {
        if (res) {
          this.groupedTransactions = res.groups;
          this.totalExpense = res.grand_total_expense;
          this.totalDeposit = res.grand_total_deposit;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Table Data Error:', err)
    });
  }

  onFilterUpdate(period: string) {
    this.activeView = period;
    this.transactionService.getGroupedTransactions(period).subscribe({
      next: (res) => {
        if (res) {
          this.groupedTransactions = res.groups;
          this.totalExpense = res.grand_total_expense;
          this.totalDeposit = res.grand_total_deposit;
          this.cdr.detectChanges();
        }
      }
    });

    this.transactionService.getCategoryExpenses(period).subscribe({
      next: (data) => {
        if (data) {
          this.chartData = [...data.series];
          this.chartLabels = [...data.labels];
          this.chartColors = [...data.colors];
          this.cdr.detectChanges();
        }
      }
    });

    this.transactionService.getDailyExpenses(period).subscribe({
      next: (data) => {
        if (data) {
          this.barData = [...data.data];
          this.barLabels = [...data.categories];
          this.cdr.detectChanges();
        }
      }
    });
  }

  onCategoryFilter(categoryName: string) {
    this.activeCategory = categoryName;

    this.transactionService.getGroupedTransactions(this.activeView, categoryName).subscribe(res => {
    this.groupedTransactions = [...res.groups];
    this.cdr.detectChanges();
    });

    this.transactionService.getCategoryExpenses(this.activeView, categoryName).subscribe(data => {
    this.chartData = data.series.length > 0 ? [...data.series] : [];
    this.chartLabels = data.labels.length > 0 ? [...data.labels] : [];
    this.chartColors = data.colors.length > 0 ? [...data.colors] : ['#718096']; // رنگ پیش‌فرض اگر خالی بود
    this.cdr.detectChanges();
    });
  
    this.transactionService.getDailyExpenses(this.activeView, categoryName).subscribe(data => {
    this.barData = [...data.data];
    this.barLabels = [...data.categories];
    this.cdr.detectChanges();
    });
    
  }
}