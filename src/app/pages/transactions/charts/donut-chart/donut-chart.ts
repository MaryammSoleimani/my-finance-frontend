// src/app/pages/transactions/charts/donut-chart/donut-chart.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="donut-wrapper">
      <apx-chart *ngIf="series && series.length > 0"
        [series]="series"
        [chart]="chartOptions.chart"
        [labels]="labels"
        [colors]="colors"
        [legend]="chartOptions.legend"
        [stroke]="chartOptions.stroke"
        [plotOptions]="chartOptions.plotOptions"
        [dataLabels]="chartOptions.dataLabels"
        [noData]="chartOptions.noData">
      </apx-chart>
      <div *ngIf="!series || series.length === 0" class="no-data">
        <p>No data available</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .donut-wrapper {
      width: 100%;
      min-height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .no-data {
      color: #718096;
      font-size: 16px;
      text-align: center;
    }
  `]
})
export class DonutChart implements OnChanges {
  @Input() series: number[] = [];
  @Input() labels: string[] = [];
  @Input() colors: string[] = [];
  @Input() centerText: string = '';
  @Input() centerSubText: string = '';

  public chartOptions: any = {
    chart: {
      type: 'donut',
      height: 320,
      width: '100%',
      redrawOnParentResize: true,
      redrawOnWindowResize: true
    },
    stroke: {
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          background: 'transparent',
          labels: {
            show: true,
            name: { show: true, color: '#718096' },
            value: { show: true, color: '#fff', fontSize: '20px' },
            total: {
              show: true,
              label: 'Total',
              color: '#718096',
              formatter: (w: any) => {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toLocaleString();
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: {
        colors: '#718096'
      },
      markers: {
        radius: 12
      }
    },
    noData: {
      text: 'No Data Available',
      style: { color: '#718096', fontSize: '16px' }
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['series'] || changes['labels']) {
      // اگر داده‌ها خالی هستند، نمودار را نشان نده
      if (this.series.length === 0) {
        return;
      }
    }
  }
}
