import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { AccountSummary } from './account-summary/account-summary';
import { AccountList } from './account-list/account-list';
import { AccountChart } from './account-chart/account-chart';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { AddAccount } from './add-account/add-account';
import { AccountData } from './account.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AccountSummary, AccountList, AccountChart, CommonModule, AddAccount],
  providers: [AccountService],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  private accountService = inject(AccountService);

  // Signals
  private assetsSignal = signal<AccountData[]>([]);
  private liabilitiesSignal = signal<AccountData[]>([]);
  private netWorthSignal = signal<number>(0);
  private totalAssetsSignal = signal<number>(0);
  private totalLiabilitiesSignal = signal<number>(0);
  private chartDataSignal = signal<any>({ series: [], dates: [], colors: [] });
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private currentPeriodSignal = signal<string>('1m');

  // Computed signals
  readonly assets = computed(() => this.assetsSignal());
  readonly liabilities = computed(() => this.liabilitiesSignal());
  readonly netWorth = computed(() => this.netWorthSignal());
  readonly totalAssets = computed(() => this.totalAssetsSignal());
  readonly totalLiabilities = computed(() => this.totalLiabilitiesSignal());
  readonly chartData = computed(() => this.chartDataSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly currentPeriod = computed(() => this.currentPeriodSignal());

  showAddAccount = false;
  editingAccount: AccountData | null = null;  // ← برای ویرایش
  periods = [
    { label: '2W', value: '2w' },
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '1Y', value: '1y' },
    { label: 'ALL', value: 'all' }
  ];

  ngOnInit() {
    this.loadAccountData();
  }

  setPeriod(period: string) {
    this.currentPeriodSignal.set(period);
    this.loadAccountData();
  }

  loadAccountData(period?: string) {
    const selectedPeriod = period || this.currentPeriodSignal();
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.accountService.getAccountSummary(selectedPeriod).pipe(
      finalize(() => this.loadingSignal.set(false))
    ).subscribe({
      next: (data: any) => {
        if (!data) return;

        this.assetsSignal.set(data.assets || []);
        this.liabilitiesSignal.set(data.liabilities || []);
        this.netWorthSignal.set(data.net_worth || 0);
        this.totalAssetsSignal.set(data.total_assets || 0);
        this.totalLiabilitiesSignal.set(data.total_liabilities || 0);
        this.chartDataSignal.set(data.chart_data || { series: [], dates: [], colors: [] });
      },
      error: (err: any) => {
        console.error('Error fetching account data:', err);
        this.errorSignal.set('Failed to load account data. Please try again.');
      }
    });
  }

  deleteAccount(id: number) {
    this.accountService.deleteAccount(id).subscribe({
      next: () => this.loadAccountData(),
      error: (err: any) => {
        console.error('Delete failed:', err);
        this.errorSignal.set('Failed to delete account.');
      }
    });
  }

  // ← متد جدید برای ویرایش
  onEditAccount(account: AccountData) {
    this.editingAccount = account;
    this.showAddAccount = true;
  }

  // ← متد جدید برای بستن مودال
  onCloseAddAccount() {
    this.showAddAccount = false;
    this.editingAccount = null;
  }
}
