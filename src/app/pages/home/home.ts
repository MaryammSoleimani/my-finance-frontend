import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { TransactionService } from '../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  username: string = '';
  latestTransactions: any[] = [];

  constructor(private authService: AuthService, private transactionService: TransactionService) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.transactionService.getLatestTransactions().subscribe({
    next: (data) => this.latestTransactions = data,
    error: (err) => console.error('Failed to load transactions', err)
  });
  }

  
}