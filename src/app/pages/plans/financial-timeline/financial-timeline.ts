// src/app/pages/plans/financial-timeline/financial-timeline.ts
import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { PlansService } from '../../../services/plans.service';

@Component({
  selector: 'app-financial-timeline',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './financial-timeline.html',
  styleUrl: './financial-timeline.css'
})
export class FinancialTimeline implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  private plansService = inject(PlansService);

  chartOptions: any = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#71717a'
    },
    series: [],
    colors: ['#3b82f6', '#a855f7'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05
      }
    },
    xaxis: {
      type: 'category',
      labels: { style: { colors: '#71717a' } }
    },
    yaxis: {
      labels: {
        style: { colors: '#71717a' },
        formatter: (val: number) => `$${(val / 1000).toFixed(1)}k`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#a1a1aa' }
    },
    grid: {
      borderColor: '#27272a',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`
      }
    }
  };

  eventAnnotations: any[] = [];
  eventList: any[] = [];

  ngOnInit() {
    this.loadTimeline();
    this.loadEvents();
  }

  loadTimeline() {
    this.plansService.getFinancialTimeline().subscribe({
      next: (data) => {
        this.chartOptions.series = [
          { name: 'Liquid', data: data.liquid },
          { name: 'Illiquid', data: data.illiquid }
        ];
        this.chartOptions.xaxis.categories = data.dates;
        this.updateAnnotations();
      },
      error: (err) => console.error('Error loading timeline:', err)
    });
  }

  loadEvents() {
    this.plansService.getEvents().subscribe({
      next: (data) => {
        this.eventList = data;
        this.updateAnnotations();
      },
      error: (err) => console.error('Error loading events:', err)
    });
  }

  updateAnnotations() {
    if (!this.eventList || !this.chartOptions.xaxis.categories) return;

    const categories = this.chartOptions.xaxis.categories;
    this.eventAnnotations = [];

    this.eventList.forEach((event: any, index: number) => {
      const eventMonthIndex = event.month - 1;
      if (eventMonthIndex >= 0 && eventMonthIndex < categories.length) {
        this.eventAnnotations.push({
          x: categories[eventMonthIndex],
          borderColor: '#3b82f6',
          fillColor: '#3b82f6',
          strokeDashArray: 4,
          label: {
            text: String(index + 1),
            style: {
              color: '#fff',
              background: '#3b82f6',
              borderRadius: '50%',
              padding: 4
            },
            orientation: 'horizontal',
            position: 'top'
          }
        });
      }
    });

    this.chartOptions.annotations = {
      xaxis: this.eventAnnotations
    };
  }

  runSimulation() {
    this.plansService.runSimulation().subscribe({
      next: () => {
        this.loadTimeline();
      },
      error: (err) => console.error('Error running simulation:', err)
    });
  }

  getEventDate(month: number): string {
    const today = new Date();
    const eventDate = new Date(today);
    eventDate.setMonth(today.getMonth() + month);
    return eventDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
