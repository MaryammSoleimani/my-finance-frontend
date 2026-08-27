// src/app/pages/transactions/transactions.ts
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TransactionSidebar } from "./transaction-sidebar/transaction-sidebar";
import { DonutChart } from './charts/donut-chart/donut-chart';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { BarChart } from './charts/bar-chart/bar-chart';
import { TransactionTable } from './transaction-table/transaction-table';
import { AddNewTransaction } from './add-new-transaction/add-new-transaction';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TransactionSidebar, DonutChart, CommonModule, BarChart, TransactionTable, AddNewTransaction],
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

  activeView: string = 'current-month';
  hasData: boolean = false;
  showAddModal: boolean = false;

  chartMode: string = 'expenses';

  donutCenterText: string = '';
  donutCenterSubText: string = '';

  barTooltipFormatter: any = null;

  constructor(
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.activeView = 'current-month';
      this.onFilterUpdate('current-month');
    }, 50);
  }

  onTransactionSaved() {
    this.showAddModal = false;
    this.onFilterUpdate(this.activeView);
  }

  setChartMode(mode: string) {
    this.chartMode = mode;
    this.loadCharts();
  }

  loadCharts() {
    const endpoint = this.chartMode === 'expenses' ? 'getCategoryExpenses' : 'getCategoryDeposits';

    this.transactionService[endpoint](this.activeView).subscribe({
      next: (data) => {
        if (data) {
          this.chartData = [...data.series];
          this.chartLabels = [...data.labels];
          this.chartColors = [...data.colors];

          if (data.center_text) {
            this.donutCenterText = data.center_text;
          }

          const total = data.series.reduce((a: number, b: number) => a + b, 0);
          this.donutCenterSubText = total.toLocaleString();

          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error loading charts:', err)
    });

    this.transactionService.getDailyExpenses(this.activeView).subscribe({
      next: (data) => {
        if (data) {
          this.barData = [...data.data];
          this.barLabels = [...data.categories];

          this.barTooltipFormatter = (val: number, opts: any) => {
            return `${opts.w.globals.seriesNames[opts.seriesIndex]}: $${val.toLocaleString()}`;
          };

          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error loading daily expenses:', err)
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
          this.hasData = this.groupedTransactions.length > 0;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Table Data Error:', err)
    });

    this.loadCharts();
  }

  onCategoryFilter(categoryName: string) {
    this.transactionService.getGroupedTransactions(this.activeView, categoryName).subscribe(res => {
      this.groupedTransactions = [...res.groups];
      this.hasData = this.groupedTransactions.length > 0;
      this.cdr.detectChanges();
    });

    this.transactionService.getCategoryExpenses(this.activeView, categoryName).subscribe(data => {
      this.chartData = data.series.length > 0 ? [...data.series] : [];
      this.chartLabels = data.labels.length > 0 ? [...data.labels] : [];
      this.chartColors = data.colors.length > 0 ? [...data.colors] : ['#718096'];
      this.cdr.detectChanges();
    });

    this.transactionService.getDailyExpenses(this.activeView, categoryName).subscribe(data => {
      this.barData = [...data.data];
      this.barLabels = [...data.categories];
      this.cdr.detectChanges();
    });
  }
}
