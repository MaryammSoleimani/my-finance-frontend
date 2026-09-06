import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TransactionService } from '../../../services/transaction.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-import-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './import-transactions.html',
  styleUrls: ['./import-transactions.css']
})
export class ImportTransactions implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() imported = new EventEmitter<void>();

  accounts: any[] = [];
  categories: any[] = [];

  selectedAccount: number | null = null;

  selectedExpenseCategory: number | null = null;
  selectedIncomeCategory: number | null = null;

  selectedFile: File | null = null;

  errorMessage = '';
  successMessage = '';

  importing = false;

  constructor(
    private transactionService: TransactionService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAccounts();
    this.loadCategories();
  }

  // =========================================================
  // LOAD ACCOUNTS
  // =========================================================

  loadAccounts() {

    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>(
      'http://127.0.0.1:8000/api/accounts/',
      { headers }
    ).subscribe({

      next: (data) => {

        this.accounts = data || [];

        if (this.accounts.length === 1) {
          this.selectedAccount = this.accounts[0].id;
        }

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(
          'Error loading accounts:',
          err
        );

        this.errorMessage =
          'Could not load accounts.';
      }
    });
  }

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  loadCategories() {

    this.transactionService
      .getCategories()
      .subscribe({

        next: (data) => {

          this.categories = data || [];

          // Try to automatically select
          // Income category.

          const incomeCategory =
            this.categories.find(
              cat =>
                cat.name.toLowerCase() === 'income'
            );

          if (incomeCategory) {
            this.selectedIncomeCategory =
              incomeCategory.id;
          }

          // Try Misc for expenses.

          const miscCategory =
            this.categories.find(
              cat =>
                cat.name.toLowerCase() === 'misc'
            );

          if (miscCategory) {
            this.selectedExpenseCategory =
              miscCategory.id;
          }

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(
            'Error loading categories:',
            err
          );

          this.errorMessage =
            'Could not load categories.';
        }
      });
  }

  // =========================================================
  // FILE SELECT
  // =========================================================

  onFileSelected(event: Event) {

    this.errorMessage = '';
    this.successMessage = '';

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      this.selectedFile = null;
      return;
    }

    const file = input.files[0];

    if (
      !file.name.toLowerCase().endsWith('.csv')
    ) {

      this.errorMessage =
        'Please select a CSV file.';

      this.selectedFile = null;

      return;
    }

    this.selectedFile = file;
  }

  // =========================================================
  // IMPORT
  // =========================================================

  importTransactions() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedFile) {

      this.errorMessage =
        'Please select a CSV file.';

      return;
    }

    if (!this.selectedAccount) {

      this.errorMessage =
        'Please select an account.';

      return;
    }

    if (!this.selectedExpenseCategory) {

      this.errorMessage =
        'Please select an expense category.';

      return;
    }

    if (!this.selectedIncomeCategory) {

      this.errorMessage =
        'Please select an income category.';

      return;
    }

    this.importing = true;

    this.transactionService.importCsv(
      this.selectedFile,
      this.selectedAccount,
      this.selectedExpenseCategory,
      this.selectedIncomeCategory
    ).subscribe({

      next: (response) => {

        this.importing = false;

        const imported =
          response.imported || 0;

        const skipped =
          response.skipped || 0;

        const errors =
          response.errors_count || 0;

        this.successMessage =
          `${imported} transactions imported successfully. ` +
          `${skipped} skipped.`;

        if (errors > 0) {

          this.successMessage +=
            ` ${errors} rows had errors.`;
        }

        this.cdr.detectChanges();

        // Give the user a moment to see result,
        // then close and refresh transaction page.

        setTimeout(() => {

          this.imported.emit();
          this.close.emit();

        }, 1200);
      },

      error: (err) => {

        console.error(
          'CSV import error:',
          err
        );

        this.importing = false;

        this.errorMessage =
          err?.error?.message ||
          'CSV import failed. Please check the file.';

        this.cdr.detectChanges();
      }
    });
  }

  // =========================================================
  // CLOSE
  // =========================================================

  closeModal() {

    if (this.importing) {
      return;
    }

    this.close.emit();
  }
}
