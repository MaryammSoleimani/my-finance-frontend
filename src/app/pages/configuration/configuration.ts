// configuration.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css'
})
export class Configuration implements OnInit {
  categories: any[] = [];
  showAddCategory: boolean = false;
  editingCategory: any = null;
  notifications: any[] = [];
  isSubmitting: boolean = false;
  showDeleteModal: boolean = false;
  categoryToDelete: any = null;
  usageCount: any = {
  transaction_count: 0,
  budget_count: 0,
  total_count: 0
};


  categoryForm = {
    name: '',
    color: '#3b82f6'
  };

  notificationPrefs: any = {
    budget_alerts: true,
    spending_alerts: true,
    goal_reminders: true,
    budget_threshold: 80
  };

  constructor(private configurationService: ConfigurationService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCategories();
    this.loadNotificationPreferences();
  }

  loadCategories() {
    this.configurationService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }



onDeleteCategory(category: any) {
  if (!category?.id) {
    console.error('Invalid category:', category);
    return;
  }

  this.categoryToDelete = category;

  // Show modal immediately
  this.showDeleteModal = true;

  // Reset values while loading
  this.usageCount = {
    transaction_count: 0,
    budget_count: 0,
    total_count: 0
  };

  console.log('Loading usage for:', category.id);

  this.configurationService.getCategoryUsage(category.id).subscribe({
    next: (data) => {
      console.log('USAGE RESPONSE:', data);

      this.usageCount = {
        transaction_count: Number(data.transaction_count),
        budget_count: Number(data.budget_count),
        total_count: Number(data.total_count)
      };

      console.log('FINAL usageCount:', this.usageCount);

      this.cdr.detectChanges();
    },

    error: (err) => {
      console.error('USAGE ERROR:', err);
      this.cdr.detectChanges();
    }
  });
}

confirmDelete() {
  if (!this.categoryToDelete) return;

  this.configurationService
    .deleteCategory(this.categoryToDelete.id)
    .subscribe({
      next: () => {
        this.loadCategories();
        this.showDeleteModal = false;
        this.categoryToDelete = null;
        this.usageCount = null;

      },
      error: (err) => console.error('Failed to delete category:', err)
    });
}

cancelDelete() {
  this.showDeleteModal = false;
  this.categoryToDelete = null;
  this.usageCount = null;

}

  loadNotificationPreferences() {
    this.configurationService.getNotificationPreferences().subscribe({
      next: (data) => {
        this.notificationPrefs = data;
      },
      error: (err) => console.error(err)
    });
  }

  onTogglePreference(key: string, value: boolean) {
    this.notificationPrefs[key] = value;
    this.configurationService.updateNotificationPreferences(this.notificationPrefs).subscribe({
      next: () => {},
      error: (err) => console.error(err)
    });
  }

  onChangeThreshold(value: number) {
    this.notificationPrefs.budget_threshold = value;
    this.configurationService.updateNotificationPreferences(this.notificationPrefs).subscribe({
      next: () => {},
      error: (err) => console.error(err)
    });
  }

  onAddCategory() {
    this.editingCategory = null;
    this.categoryForm = { name: '', color: '#3b82f6' };
    this.showAddCategory = true;
  }

  onEditCategory(category: any) {
    this.editingCategory = category;
    this.categoryForm = {
      name: category.name,
      color: category.color
    };
    this.showAddCategory = true;
  }

  saveCategory() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    if (this.editingCategory) {
      this.configurationService.updateCategory(this.editingCategory.id, this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.showAddCategory = false;
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.configurationService.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.showAddCategory = false;
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
        }
      });
    }
  }

  onToggleNotification(id: number, enabled: boolean) {
    this.configurationService.updateNotification(id, { enabled }).subscribe({
      next: () => this.loadNotificationPreferences(),
      error: (err) => console.error(err)
    });
  }
}
