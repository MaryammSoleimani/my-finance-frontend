import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlansService } from '../../../services/plans.service';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assets.html',
  styleUrl: './assets.css',
})
export class Assets implements OnInit {
  assets: any[] = [];
  showModal = false;
  showImportModal = false;

  newAsset = {
    name: '',
    amount: 0,
    asset_type: 'liquid',
    growth_rate: 0,
    liquidity_penalty: 0,
    annual_income_rate: 0
  };

  availableAccounts: any[] = [];
  selectedAccountIds: number[] = [];

  isEditMode = false;
  editingId: number | null = null;

  assetTypes = [
    { value: 'liquid', label: 'Liquid' },
    { value: 'illiquid', label: 'Illiquid' }
  ];

  constructor(private plansService: PlansService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.plansService.getAssets().subscribe({
      next: (data) => {
        this.assets = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading assets:', err)
    });
  }

  onSubmit() {
    if (this.isEditMode && this.editingId) {
      this.plansService.updateAsset(this.editingId, this.newAsset).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error updating asset:', err)
      });
    } else {
      this.plansService.addAsset(this.newAsset).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: (err) => console.error('Error adding asset:', err)
      });
    }
  }

  onDelete(id: number) {
    this.plansService.deleteAsset(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error deleting asset:', err)
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.editingId = null;
    this.newAsset = {
      name: '',
      amount: 0,
      asset_type: 'liquid',
      growth_rate: 0,
      liquidity_penalty: 0,
      annual_income_rate: 0
    };
  }

  onEdit(asset: any) {
    this.isEditMode = true;
    this.editingId = asset.id;
    this.newAsset = { ...asset };
    this.showModal = true;
  }

  // Import methods
  importFromAccounts() {
    this.plansService.import_from_accounts().subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => console.error('Error importing from accounts:', err)
    });
  }

  openImportModal() {
    this.plansService.getAvailableAccounts().subscribe({
      next: (accounts) => {
        this.availableAccounts = accounts;
        this.selectedAccountIds = [];
        this.showImportModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading available accounts:', err)
    });
  }

  toggleAccountSelection(id: number) {
    const index = this.selectedAccountIds.indexOf(id);
    if (index > -1) {
      this.selectedAccountIds.splice(index, 1);
    } else {
      this.selectedAccountIds.push(id);
    }
  }

  confirmImport() {
    if (this.selectedAccountIds.length === 0) return;

    this.plansService.importSelectedAccounts(this.selectedAccountIds).subscribe({
      next: () => {
        this.loadData();
        this.showImportModal = false;
      },
      error: (err) => console.error('Error importing selected accounts:', err)
    });
  }
}
