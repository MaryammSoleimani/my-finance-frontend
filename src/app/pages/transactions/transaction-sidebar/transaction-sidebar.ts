import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-sidebar.html',
  styleUrl: './transaction-sidebar.css'
})
export class TransactionSidebar implements OnInit {
  @Output() filterChanged = new EventEmitter<string>();
  @Output() categoryChanged = new EventEmitter<string>();

  menus: any = {
    month: true,
    day: false,
    year: false,
    misc: false,
    budget: false
  };

  activeView: string = 'current-month';
  selectedCat: string = '';

  // Advanced filters
  showAdvancedFilters: boolean = false;

  // دسته‌بندی‌ها
  categories: any[] = [];
  showAllCategories: boolean = false;

  // ماه‌ها
  months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
  selectedMonths: string[] = [];
  showAllMonths: boolean = false;

  // سال‌ها
  years: string[] = ['2023', '2024', '2025', '2026'];
  selectedYears: string[] = [];

  // ماه‌های قابل نمایش
  get visibleMonths() {
    return this.showAllMonths ? this.months : this.months.slice(0, 6);
  }

  // دسته‌بندی‌های قابل نمایش
  get visibleCategories() {
    return this.showAllCategories ? this.categories : this.categories.slice(0, 6);
  }

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadYears();
  }

  loadCategories() {
    this.transactionService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  loadYears() {
    this.transactionService.getTransactionYears().subscribe({
      next: (data) => {
        this.years = data.map(year => year.toString());
      },
      error: (err) => {
        console.error('Error fetching years:', err);
        this.years = ['2023', '2024', '2025', '2026'];
      }
    });
  }

  toggleMenu(menuName: string) {
    this.menus[menuName] = !this.menus[menuName];
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  selectView(view: string) {
    this.activeView = view;
    this.filterChanged.emit(view);
    this.selectedCat = '';
  }

  selectCategory(category: string) {
    this.selectedCat = category;
    this.categoryChanged.emit(category);
  }

  clearCategoryFilter() {
    this.selectedCat = '';
    this.categoryChanged.emit('');
  }

  selectAllCategories() {
    this.selectedCat = 'all';
    this.categoryChanged.emit('all');
  }

  toggleMonth(month: string) {
    if (this.selectedMonths.includes(month)) {
      this.selectedMonths = this.selectedMonths.filter(m => m !== month);
    } else {
      this.selectedMonths.push(month);
    }
  }

  clearMonthFilter() {
    this.selectedMonths = [];
  }

  selectAllMonths() {
    this.selectedMonths = [...this.months];
  }

  toggleYear(year: string) {
    if (this.selectedYears.includes(year)) {
      this.selectedYears = this.selectedYears.filter(y => y !== year);
    } else {
      this.selectedYears.push(year);
    }
  }

  clearYearFilter() {
    this.selectedYears = [];
  }

  selectAllYears() {
    this.selectedYears = [...this.years];
  }
}
