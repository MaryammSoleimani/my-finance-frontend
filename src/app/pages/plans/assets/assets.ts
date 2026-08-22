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
export class Assets {

  assets: any[] = [];
  showModal = false;

  newAsset = {
    name: '',
    amount: 0,
    asset_type: 'liquid',
    growth_rate: 0
  };

  showImportModal = false;
  availableAccounts: any[] = [];
  selectedAccountIds: number[] = [];

  isEditMode = false;
  editingId: number | null = null;


  constructor(private plansService: PlansService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.plansService.getAssets().subscribe(data => {
      this.assets = data;
      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (this.isEditMode && this.editingId) {
      this.plansService.updateAsset(this.editingId, this.newAsset).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    } else {
      this.plansService.addAsset(this.newAsset).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    }
  }

  onDelete(id: number) {
    this.plansService.deleteAsset(id).subscribe(() => this.loadData());
  }

  openModal() { 
    this.showModal = true; 
  }

  closeModal() { 
    this.showModal = false;
    this.isEditMode = false;
    this.editingId = null;
    this.newAsset = { name: '', amount: 0, asset_type: 'liquid', growth_rate: 0 };
  }

  importFromAccounts() {
    this.plansService.import_from_accounts().subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => console.error(err)
    });
  }

  openImportModal() {
    this.plansService.getAvailableAccounts().subscribe(accounts => {
      this.availableAccounts = accounts;
      this.selectedAccountIds = [];
      this.showImportModal = true;
      this.cdr.detectChanges();
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
    
    this.plansService.importSelectedAccounts(this.selectedAccountIds).subscribe(() => {
      this.loadData();
      this.showImportModal = false;
    });
  }

  onEdit(asset: any) {
    this.isEditMode = true;
    this.editingId = asset.id;
    this.newAsset = { ...asset };
    this.showModal = true;
  }

}
