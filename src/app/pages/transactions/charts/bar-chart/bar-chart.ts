// bar-chart.ts
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
    <div *ngIf="!data || data.length === 0" class="no-data">
      <p>No data available</p>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .chart-card { width: 100%; min-height: 320px; }
    .no-data {
      color: #718096;
      font-size: 16px;
      text-align: center;
      padding: 40px;
    }
  `]
})
export class BarChart implements OnChanges {
  @Input() data: number[] = [];
  @Input() categories: string[] = [];
  @Input() colors: string[] = [];
  @Input() tooltipFormatter: any = null;

  public chartOptions: any = {
    series: [{ name: 'هزینه‌ها', data: [] }],
    chart: {
      type: 'bar',
      height: 320,
      width: '100%',
      background: 'transparent',
      toolbar: { show: false },
      redrawOnParentResize: true,
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
      labels: {
        style: { colors: '#718096' },
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        formatter: (val: string) => {
          // تبدیل تاریخ میلادی به شمسی
          if (val && val.includes('-')) {
            const parts = val.split('-');
            if (parts.length === 3) {
              return `${parts[2]}/${parts[1]}`;  // فرض: yyyy-mm-dd
            }
          }
          return val;
        }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#718096' },
        formatter: (val: number) => {
          // تبدیل به تومان با فرمت خوانا
          if (val >= 1000000) {
            return `${(val / 1000000).toFixed(1)}M تومان`;
          } else if (val >= 1000) {
            return `${(val / 1000).toFixed(0)}K تومان`;
          }
          return `${val} تومان`;
        }
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => {
          return `${val.toLocaleString()} تومان`;
        }
      }
    },
    grid: { borderColor: '#2d3748', strokeDashArray: 4 }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['categories'] || changes['colors']) {
      this.chartOptions = {
        ...this.chartOptions,
        series: [{ name: 'هزینه‌ها', data: [...this.data] }],
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: [...this.categories]
        },
        colors: (this.colors && this.colors.length > 0) ? this.colors : ['#22c55e']
      };
    }

    if (changes['tooltipFormatter'] && this.tooltipFormatter) {
      this.chartOptions = {
        ...this.chartOptions,
        tooltip: {
          ...this.chartOptions.tooltip,
          y: {
            formatter: this.tooltipFormatter
          }
        }
      };
    }
  }
}
