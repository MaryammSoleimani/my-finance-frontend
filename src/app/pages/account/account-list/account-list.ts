import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-list.html',
  styleUrl: './account-list.css'
})
export class AccountList {
  @Input() assets: any[] = [];
  @Input() liabilities: any[] = [];
  @Output() deleteAccount = new EventEmitter<number>();

  isModalOpen = false;
  accountToDelete: any = null;

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this account?')) {
      this.deleteAccount.emit(id);
    }
  }

  openConfirm(account: any) {
    this.accountToDelete = account;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.accountToDelete = null;
  }

  confirmDeletion() {
    if (this.accountToDelete) {
      this.deleteAccount.emit(this.accountToDelete.id);
      this.closeModal();
    }
  }
}