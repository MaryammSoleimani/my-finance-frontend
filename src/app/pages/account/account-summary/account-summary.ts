import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-summary.html',
  styleUrls: ['./account-summary.css']
})
export class AccountSummary {
  @Input() netWorth: number = 0;
  @Input() totalAssets: number = 0;
  @Input() totalLiabilities: number = 0;
}