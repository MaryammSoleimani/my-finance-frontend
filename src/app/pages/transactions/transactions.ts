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
  const categoryEndpoint =
    this.chartMode === 'expenses'
      ? 'getCategoryExpenses'
      : 'getCategoryDeposits';

  const dailyEndpoint =
    this.chartMode === 'expenses'
      ? 'getDailyExpenses'
      : 'getDailyDeposits';

  // Reset charts before loading new data
  this.chartData = [];
  this.chartLabels = [];
  this.chartColors = [];
  this.barData = [];
  this.barLabels = [];
  this.donutCenterText = '';
  this.donutCenterSubText = '';

  // =========================
  // DONUT CHART
  // =========================

  this.transactionService[categoryEndpoint](this.activeView).subscribe({
    next: (data) => {

      if (!data || !data.series || data.series.length === 0) {
        this.chartData = [];
        this.chartLabels = [];
        this.chartColors = [];
        this.donutCenterText = '';
        this.donutCenterSubText = '';

        this.cdr.detectChanges();
        return;
      }

      this.chartData = [...data.series];
      this.chartLabels = [...data.labels];
      this.chartColors = [...data.colors];

      this.donutCenterText = data.center_text || '';

      const total = data.series.reduce(
        (a: number, b: number) => a + b,
        0
      );

      this.donutCenterSubText = total.toLocaleString();

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error('Error loading category chart:', err);

      this.chartData = [];
      this.chartLabels = [];
      this.chartColors = [];

      this.cdr.detectChanges();
    }
  });


  // =========================
  // BAR CHART
  // =========================

  this.transactionService[dailyEndpoint](this.activeView).subscribe({
    next: (data) => {

      if (!data || !data.data || data.data.length === 0) {
        this.barData = [];
        this.barLabels = [];

        this.cdr.detectChanges();
        return;
      }

      this.barData = [...data.data];
      this.barLabels = [...data.categories];

     this.barTooltipFormatter = (val: number, opts: any) => {
        const label = this.chartMode === 'expenses'
          ? 'Expenses'
          : 'Deposits';

        return `${label}: $${val.toLocaleString()}`;
     };

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error('Error loading daily chart:', err);

      this.barData = [];
      this.barLabels = [];

      this.cdr.detectChanges();
    }
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

  const categoryEndpoint =
    this.chartMode === 'expenses'
      ? 'getCategoryExpenses'
      : 'getCategoryDeposits';

  const dailyEndpoint =
    this.chartMode === 'expenses'
      ? 'getDailyExpenses'
      : 'getDailyDeposits';


  // =========================
  // TABLE
  // =========================

  this.transactionService
    .getGroupedTransactions(this.activeView, categoryName)
    .subscribe({
      next: (res) => {
        this.groupedTransactions = [...res.groups];

        this.hasData = this.groupedTransactions.length > 0;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Category table error:', err);
      }
    });


  // =========================
  // DONUT
  // =========================

  this.transactionService[categoryEndpoint](
    this.activeView,
    categoryName
  ).subscribe({
    next: (data) => {

      if (!data || data.series.length === 0) {
        this.chartData = [];
        this.chartLabels = [];
        this.chartColors = [];
        this.donutCenterText = '';
        this.donutCenterSubText = '';

        this.cdr.detectChanges();
        return;
      }

      this.chartData = [...data.series];
      this.chartLabels = [...data.labels];
      this.chartColors = [...data.colors];

      const total = data.series.reduce(
        (a: number, b: number) => a + b,
        0
      );

      this.donutCenterSubText = total.toLocaleString();

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error('Category donut error:', err);
    }
  });


  // =========================
  // BAR
  // =========================

  this.transactionService[dailyEndpoint](
    this.activeView,
    categoryName
  ).subscribe({
    next: (data) => {

      if (!data || data.data.length === 0) {
        this.barData = [];
        this.barLabels = [];

        this.cdr.detectChanges();
        return;
      }

      this.barData = [...data.data];
      this.barLabels = [...data.categories];

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error('Category bar error:', err);
    }
  });
}
}
