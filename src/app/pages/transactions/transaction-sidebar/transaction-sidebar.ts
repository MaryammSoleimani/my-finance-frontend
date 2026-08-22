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
export class TransactionSidebar implements OnInit{
  @Output() filterChanged = new EventEmitter<string>();
  @Output() categoryChanged = new EventEmitter<string>();

  menus: any = { week: true, month: true, day: false, year: false, misc: false, budget: false };
  activeView: string = 'current-week';
  selectedCat: string = '';

  categories: any[] = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June'];
  years = ['2023', '2024', '2025', '2026'];

  constructor(private transactionService: TransactionService) {}


  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.transactionService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  toggleMenu(menuName: string) {
    this.menus[menuName] = !this.menus[menuName];
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
}