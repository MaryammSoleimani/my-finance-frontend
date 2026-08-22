import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="chart-card" *ngIf="data && data.length > 0">
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [xaxis]="chartOptions.xaxis"
        [yaxis]="chartOptions.yaxis"
        [plotOptions]="chartOptions.plotOptions"
        [colors]="chartOptions.colors"
        [dataLabels]="chartOptions.dataLabels"
        [tooltip]="chartOptions.tooltip"
        [grid]="chartOptions.grid">
      </apx-chart>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .chart-card { width: 100%; min-height: 320px; }
  `]
})
export class BarChart implements OnChanges {
  @Input() data: number[] = [];
  @Input() categories: string[] = [];
  @Input() colors: string[] = [];

  //private myColors = ['#22c55e', '#ef4444', '#a855f7', '#3b82f6', '#f59e0b', '#ec4899', '#14b8a6', '#64748b', '#6366f1'];

  public chartOptions: any = {
    series: [{ name: 'Daily Expense', data: [] }],
    chart: { 
      type: 'bar', 
      height: 320, 
      width: '100%',
      background: 'transparent', 
      toolbar: { show: false },
      redrawOnParentResize: true, // بسیار مهم برای جابه‌جایی تب‌ها
      redrawOnWindowResize: true
    },
    plotOptions: {
      bar: {
        columnWidth: '65%',
        distributed: true,
        borderRadius: 8,
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: { enabled: false },
    colors: ['#22c55e'],
    xaxis: {
      categories: [],
      axisBorder: { show: false },
      labels: { style: { colors: '#718096' } }
    },
    yaxis: {
      labels: {
        style: { colors: '#718096' },
        formatter: (val: number) => '$' + val.toLocaleString()
      }
    },
    tooltip: { theme: 'dark' },
    grid: { borderColor: '#2d3748', strokeDashArray: 4 }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['categories'] || changes['colors']) {
      this.chartOptions = {
        ...this.chartOptions,
        series: [{ name: 'Expenses', data: [...this.data] }],
        xaxis: { 
          ...this.chartOptions.xaxis, 
          categories: [...this.categories] 
        },
        colors: (this.colors && this.colors.length > 0) ? this.colors : ['#22c55e']
      };
    }
  }
}