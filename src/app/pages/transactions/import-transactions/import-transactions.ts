import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, CsvImportResponse } from '../../../services/transaction.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface UnmatchedTransaction {
  row: number;
  date: string;
  description: string;
  amount: number;
  kind: string;
  account_id: number;
  selectedCategoryId: number | null;
  categories: any[];
}

@Component({
  selector: 'app-import-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './import-transactions.html',
  styleUrls: ['./import-transactions.css']
})
export class ImportTransactions implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() imported = new EventEmitter<void>();

  accounts: any[] = [];
  selectedAccount: number | null = null;
  selectedFile: File | null = null;

  errorMessage = '';
  successMessage = '';
  importing = false;

  // NEW: Preview data
  showPreview = false;
  previewTransactions: UnmatchedTransaction[] = [];
  allCategories: any[] = [];
  importedCount = 0;
  skippedCount = 0;
  hasUnmatched = false;

  constructor(
    private transactionService: TransactionService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAccounts();
    this.loadAllCategories();
  }

  loadAccounts() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>('http://127.0.0.1:8000/api/accounts/', { headers })
      .subscribe({
        next: (data) => {
          this.accounts = data || [];
          if (this.accounts.length === 1) {
            this.selectedAccount = this.accounts[0].id;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading accounts:', err);
          this.errorMessage = 'Could not load accounts.';
        }
      });
  }

  loadAllCategories() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any[]>('http://127.0.0.1:8000/api/categories/', { headers })
      .subscribe({
        next: (data) => {
          this.allCategories = data || [];
        },
        error: (err) => {
          console.error('Error loading categories:', err);
        }
      });
  }

  onFileSelected(event: Event) {
    this.errorMessage = '';
    this.successMessage = '';
    this.showPreview = false;
    this.previewTransactions = [];

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      return;
    }

    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.errorMessage = 'Please select a CSV file.';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  importTransactions() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.selectedFile) {
      this.errorMessage = 'Please select a CSV file.';
      return;
    }

    if (!this.selectedAccount) {
      this.errorMessage = 'Please select an account.';
      return;
    }

    this.importing = true;
    this.showPreview = false;

    this.transactionService.importCsv(this.selectedFile, this.selectedAccount)
      .subscribe({
        next: (response: any) => {
          this.importing = false;
          this.importedCount = response.imported || 0;
          this.skippedCount = response.skipped || 0;
          this.hasUnmatched = response.has_unmatched || false;

          if (this.hasUnmatched && response.unmatched) {
            // Show preview for unmatched transactions
            this.previewTransactions = response.unmatched.map((tx: any) => ({
              ...tx,
              selectedCategoryId: null,
              categories: this.allCategories
            }));
            this.showPreview = true;
            this.successMessage = `${this.importedCount} transactions imported. ${this.previewTransactions.length} transactions need category assignment.`;
          } else {
            this.successMessage = `${this.importedCount} transactions imported successfully. ${this.skippedCount} skipped.`;
            setTimeout(() => {
              this.imported.emit();
              this.close.emit();
            }, 1500);
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('CSV import error:', err);
          this.importing = false;
          this.errorMessage = err?.error?.message || 'CSV import failed. Please check the file.';
          this.cdr.detectChanges();
        }
      });
  }

  // ============================================================
  // NEW: Save unmatched transactions with selected categories
  // ============================================================

  saveUnmatchedTransactions() {
    // Check if all unmatched transactions have a category selected
    const unassigned = this.previewTransactions.filter(tx => !tx.selectedCategoryId);
    if (unassigned.length > 0) {
      this.errorMessage = `Please select a category for all ${unassigned.length} unmatched transactions.`;
      return;
    }

    this.importing = true;

    const payload = {
      transactions: this.previewTransactions.map(tx => ({
        id: tx.row,
        account_id: tx.account_id,
        date: tx.date,
        description: tx.description,
        amount: tx.amount,
        kind: tx.kind,
        category_id: tx.selectedCategoryId
      }))
    };

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.post('http://127.0.0.1:8000/api/transaction/save-unmatched/', payload, { headers })
      .subscribe({
        next: (response: any) => {
          this.importing = false;
          this.showPreview = false;
          this.successMessage = `All ${this.previewTransactions.length} transactions saved successfully.`;

          setTimeout(() => {
            this.imported.emit();
            this.close.emit();
          }, 1500);
        },
        error: (err) => {
          console.error('Error saving unmatched transactions:', err);
          this.importing = false;
          this.errorMessage = 'Failed to save unmatched transactions.';
          this.cdr.detectChanges();
        }
      });
  }

  closeModal() {
    if (this.importing) return;
    this.close.emit();
  }
}
