// transaction-table.ts
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewTransaction } from '../add-new-transaction/add-new-transaction';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, AddNewTransaction],
  templateUrl: './transaction-table.html',
  styleUrls: ['./transaction-table.css']
})
export class TransactionTable implements OnInit {
  @Input() groups: any[] = [];
  @Input() grandTotalExpense: number = 0;
  @Input() grandTotalDeposit: number = 0;
  @Input() showAddModal: boolean = false;  // ← اضافه کنید

  @Output() refreshData = new EventEmitter<void>();
  @Output() showAddModalChange = new EventEmitter<boolean>();  // ← اضافه کنید

  expandedRows: Set<string> = new Set();
  latestTransactions: any[] = [];

  avgExpense: number = 0;
  avgDeposit: number = 0;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadLatestTransactions();
    this.calculateAverages();
  }

  calculateAverages() {
    const groupCount = this.groups.length || 1;
    this.avgExpense = this.grandTotalExpense / groupCount;
    this.avgDeposit = this.grandTotalDeposit / groupCount;
  }

  toggleRow(catName: string) {
    if (this.expandedRows.has(catName)) {
      this.expandedRows.delete(catName);
    } else {
      this.expandedRows.add(catName);
    }
    this.expandedRows = new Set(this.expandedRows);
  }

  onTransactionSaved() {
    this.showAddModal = false;
    this.showAddModalChange.emit(false);  // ← اضافه کنید
    this.loadLatestTransactions();
    this.refreshData.emit();
  }

  loadLatestTransactions() {
    this.transactionService.getLatestTransactions().subscribe({
      next: (data) => {
        this.latestTransactions = data;
      },
      error: (err) => console.error(err)
    });
  }
}
