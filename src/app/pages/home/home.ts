import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { TransactionService } from '../../services/transaction.service';
import { BudgetService } from '../../services/budget.service';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  username: string = '';
  latestTransactions: any[] = [];
  budgetSummary: any = null;
  accountSummary: any = null;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private budgetService: BudgetService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.loadLatestTransactions();
    this.loadBudgetSummary();
    this.loadAccountSummary();
  }

  loadLatestTransactions() {
    this.transactionService.getLatestTransactions().subscribe({
      next: (data) =>{
         this.latestTransactions = data.slice(0, 4);
        this.cdr.detectChanges();
        },
      error: (err) => console.error('Failed to load transactions', err)
    });
  }

  loadBudgetSummary() {
    this.budgetService.getSummary('monthly').subscribe({
      next: (data) =>{
        this.budgetSummary = data;
        this.cdr.detectChanges();},
      error: (err) => console.error('Failed to load budget', err)
    });
  }

  loadAccountSummary() {
    this.accountService.getAccountSummary().subscribe({
      next: (data) => {
        this.accountSummary = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load accounts', err)
    });
  }
}
