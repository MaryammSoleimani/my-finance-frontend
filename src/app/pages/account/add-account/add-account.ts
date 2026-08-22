import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-add-account',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './add-account.html',
  styleUrl: './add-account.css',
})
export class AddAccount {
  name: string = '';
  balance: number = 0;
  color: string = '#3b82f6';
  is_debt: boolean = false;
  type: string = 'account';

  accountTypes = [
    { value: 'account', label: 'Regular Account' },
    { value: 'investment', label: 'Investment' },
    { value: 'card', label: 'Credit Card' }
  ];

  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  constructor(private accountService: AccountService) {}

  save() {
    const newAcc = {
      name: this.name,
      balance: this.balance,
      color: this.color,
      is_debt: this.is_debt,
      type: this.type
    };

    this.accountService.createAccount(newAcc).subscribe({
      next: () => {
        this.refresh.emit(); 
        this.close.emit(); 
      },
      error: (err) => console.error('Error creating account:', err)
    });
  }
}