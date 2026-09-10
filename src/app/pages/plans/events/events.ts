// src/app/pages/plans/events/events.ts

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlansService } from '../../../services/plans.service';


@Component({
  selector: 'app-events',

  standalone: true,

  imports: [
    FormsModule,
    CommonModule
  ],

  templateUrl: './events.html',

  styleUrl: './events.css'
})
export class Events implements OnInit {

  events: any[] = [];

  cashFlows: any[] = [];

  showModal: boolean = false;


  newEvent = {
    name: '',
    amount: 0,
    event_type: 'income_change',
    month: 1,
    cash_flow_id: null as number | null,
    description: ''
  };


  isEditMode: boolean = false;

  editingId: number | null = null;


  eventTypes = [
    {
      value: 'income_change',
      label: 'تغییر درآمد'
    },
    {
      value: 'expense_change',
      label: 'تغییر هزینه'
    },
    {
      value: 'asset_transfer',
      label: 'انتقال دارایی'
    }
  ];


  constructor(
    private plansService: PlansService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadData();

    this.loadCashFlows();

  }


  loadData(): void {

    this.plansService
      .getEvents()
      .subscribe({

        next: (data) => {

          this.events = data || [];

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error loading events:',
            err
          );

        }

      });

  }


  loadCashFlows(): void {

    this.plansService
      .getCashFlows()
      .subscribe({

        next: (data) => {

          this.cashFlows = data || [];

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Error loading cash flows:',
            err
          );

        }

      });

  }


  onSubmit(): void {

    if (
      this.isEditMode &&
      this.editingId
    ) {

      this.plansService
        .updateEvent(
          this.editingId,
          this.newEvent
        )
        .subscribe({

          next: () => {

            this.loadData();

            this.closeModal();

          },

          error: (err) => {

            console.error(
              'Error updating event:',
              err
            );

          }

        });

      return;

    }


    this.plansService
      .addEvent(this.newEvent)
      .subscribe({

        next: () => {

          this.loadData();

          this.closeModal();

        },

        error: (err) => {

          console.error(
            'Error adding event:',
            err
          );

        }

      });

  }


  onDelete(id: number): void {

    this.plansService
      .deleteEvent(id)
      .subscribe({

        next: () => {

          this.loadData();

        },

        error: (err) => {

          console.error(
            'Error deleting event:',
            err
          );

        }

      });

  }


  openModal(): void {

    this.showModal = true;

  }


  closeModal(): void {

    this.showModal = false;

    this.isEditMode = false;

    this.editingId = null;


    this.newEvent = {
      name: '',
      amount: 0,
      event_type: 'income_change',
      month: 1,
      cash_flow_id: null,
      description: ''
    };

  }


  onEdit(event: any): void {

    this.isEditMode = true;

    this.editingId = event.id;

    this.newEvent = {
      ...event
    };

    this.showModal = true;

  }


  getEventTypeLabel(type: string): string {

    const types: {
      [key: string]: string
    } = {

      income_change: 'تغییر درآمد',

      expense_change: 'تغییر هزینه',

      asset_transfer: 'انتقال دارایی'

    };


    return types[type] || type;

  }

}
