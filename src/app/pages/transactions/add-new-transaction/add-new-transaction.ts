import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-add-new-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-new-transaction.html',
  styleUrls: ['./add-new-transaction.css']
})
export class AddNewTransaction implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  categories: any[] = [];
  accounts: any[] = [];

  newData = {
    date: new Date().toISOString().split('T')[0],
    amount: null,
    desc: '',
    kind: 'expense',
    account: null,
    category: null
  };

  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.loadDropdownData();
  }

  loadDropdownData() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/categories/').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.categories = data;
        } else {
          this.categories = this.getDefaultCategories();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.categories = this.getDefaultCategories();
        this.cdr.detectChanges();
      }
    });

    this.http.get<any>('http://127.0.0.1:8000/api/accounts/').subscribe({
      next: (data) => {
        this.accounts = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.accounts = [];
      }
    });
  }

  private getDefaultCategories(): any[] {
    return [
      { id: 1, name: 'Groceries' },
      { id: 2, name: 'Travel' },
      { id: 3, name: 'Gas' },
      { id: 4, name: 'Insurance' },
      { id: 5, name: 'Misc' },
      { id: 6, name: 'Subscriptions' },
      { id: 7, name: 'Credit Card Payments' },
      { id: 8, name: 'Entertainment' },
      { id: 9, name: 'Housing' },
      { id: 10, name: 'Income' }
    ];
  }

  save() {
    this.errorMessage = '';

    let emptyFields = [];

    if (!this.newData.amount) emptyFields.push('Amount');
    if (!this.newData.desc) emptyFields.push('Description');
    if (!this.newData.account) emptyFields.push('Account');
    if (!this.newData.category) emptyFields.push('Category');

    if (emptyFields.length > 0) {
      this.errorMessage = 'Please fill: ' + emptyFields.join(', ');
      return;
    }

    const payload = {
      ...this.newData,
      amount: Number(this.newData.amount),
      account: Number(this.newData.account),
      category: Number(this.newData.category)
    };

    this.transactionService.createTransaction(payload).subscribe({
      next: (res) => {
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => {
        this.errorMessage = 'Server error. Please try again.';
      }
    });
  }
}
