
import { Component, EventEmitter, Output, Input, OnInit, inject } from '@angular/core';
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
export class AddAccount implements OnInit {
  @Input() account: any = null;  // اگر ویرایش باشد، این مقدار پر می‌شود
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

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

  private accountService = inject(AccountService);

  ngOnInit() {
    // اگر حساب برای ویرایش است، داده‌ها را پر کنید
    if (this.account) {
      this.name = this.account.name;
      this.balance = this.account.balance;
      this.color = this.account.color;
      this.is_debt = this.account.is_debt;
      this.type = this.account.type;
    }
  }

  save() {
    const accountData = {
      name: this.name,
      balance: this.balance,
      color: this.color,
      is_debt: this.is_debt,
      type: this.type
    };

    if (this.account) {
      // حالت ویرایش
      this.accountService.updateAccount(this.account.id, accountData).subscribe({
        next: () => {
          this.refresh.emit();
          this.close.emit();
        },
        error: (err) => console.error('Error updating account:', err)
      });
    } else {
      // حالت ایجاد
      this.accountService.createAccount(accountData).subscribe({
        next: () => {
          this.refresh.emit();
          this.close.emit();
        },
        error: (err) => console.error('Error creating account:', err)
      });
    }
  }
}
