import { Component, EventEmitter, Output, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-new-transaction',
  standalone: true,
  //changeDetection: ChangeDetectionStrategy.OnPush,
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

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDropdownData();
    console.log(this.newData);
    //this.errorMessage = 'Manual Test Error';
  }

  loadDropdownData() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/categories/').subscribe(data => {
      this.categories = data;
      this.cdr.detectChanges();
    });
    
    this.http.get<any>('http://127.0.0.1:8000/api/accounts/').subscribe(data => {
      this.accounts = data;
      this.cdr.detectChanges(); 
    });
  }


  errorMessage: string = '';

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

    this.http.post('http://127.0.0.1:8000/api/transaction/main/', payload)
      .subscribe({
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