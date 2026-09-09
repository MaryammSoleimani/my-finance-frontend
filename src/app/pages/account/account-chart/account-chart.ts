// account-chart.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-account-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div id="chart" style="background: #121212; padding: 20px; border-radius: 10px;">
      <apx-chart
        [series]="chartOptions.series"
        [chart]="chartOptions.chart"
        [xaxis]="chartOptions.xaxis"
        [dataLabels]="chartOptions.dataLabels"
        [stroke]="chartOptions.stroke"
        [fill]="chartOptions.fill"
        [colors]="chartOptions.colors"
        [yaxis]="chartOptions.yaxis"
        [legend]="chartOptions.legend"
        [tooltip]="chartOptions.tooltip"
        [markers]="chartOptions.markers">
      </apx-chart>
    </div>
  `
})
export class AccountChart implements OnChanges {
  @Input() data: any = { series: [], dates: [], colors: [] };

  public chartOptions: any = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#71717a'
    },
    series: [],
    colors: [],
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
      labels: {
        style: { colors: '#71717a' },
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        formatter: (val: string) => {
          // تبدیل تاریخ میلادی به شمسی
          if (val && val.includes('-')) {
            const parts = val.split('-');
            if (parts.length === 3) {
              return `${parts[2]}/${parts[1]}`;
            }
          }
          return val;
        }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#71717a' },
        formatter: (val: number) => {
          if (val >= 1000000) {
            return `${(val / 1000000).toFixed(1)}M تومان`;
          } else if (val >= 1000) {
            return `${(val / 1000).toFixed(0)}K تومان`;
          }
          return `${val} تومان`;
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#a1a1aa' }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => {
          return `${val.toLocaleString()} تومان`;
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.chartOptions.series = this.data.series || [];
      this.chartOptions.colors = this.data.colors || [];
      this.chartOptions.xaxis.categories = this.data.dates || [];
    }
  }
}
