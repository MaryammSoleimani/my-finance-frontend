import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  TranslatePipe
} from '@ngx-translate/core';
import {
  NgApexchartsModule
} from 'ng-apexcharts';
import {
  PlansService
} from '../../../services/plans.service';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexTooltip,
  ApexAnnotations
} from 'ng-apexcharts';

@Component({
  selector:'app-financial-timeline',
  standalone:true,
  imports:[
    CommonModule,
    TranslatePipe,
    NgApexchartsModule
  ],
  templateUrl:'./financial-timeline.html',
  styleUrl:'./financial-timeline.css'
})
export class FinancialTimeline implements OnInit{

  eventList:any[]=[];

  chartOptions:any={
    series:[],
    chart:{
      type:'area',
      height:350,
      toolbar:{
        show:false
      }
    },
    xaxis:{
      categories:[]
    },
    dataLabels:{
      enabled:false
    },
    stroke:{
      curve:'smooth'
    },
    fill:{
      opacity:.3
    },
    yaxis:{
      labels:{
        formatter:(value:number)=>{
          return this.formatMoney(value);
        }
      }
    },
    tooltip:{
      y:{
        formatter:(value:number)=>{
          return this.formatMoney(value);
        }
      }
    },
    legend:{
      position:'top'
    },
    grid:{},
    annotations:{}
  };

  constructor(
    private plansService:PlansService,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit(){
    this.loadTimeline();
  }

  loadTimeline(){

    this.plansService
    .getFinancialTimeline()
    .subscribe({
      next:(data)=>{
        this.prepareChart(data);
        this.cdr.detectChanges();
      },
      error:(err)=>{
        console.error(
          'Error loading financial timeline:',
          err
        );
      }
    });

  }

  prepareChart(data:any){

    if(!data){
      return;
    }

    const categories =
      data.months ||
      data.labels ||
      [];

    this.eventList=data.events || [];

    this.chartOptions.series=[
      {
        name:'timeline.liquid_asset',
        data:data.liquid || []
      },
      {
        name:'timeline.illiquid_asset',
        data:data.illiquid || []
      }
    ];

    this.chartOptions.xaxis={
      categories:categories.map(
        (item:any)=>
        this.formatMonth(item)
      )
    };

  }

  runSimulation(){
    this.loadTimeline();
  }

  getEventDate(month:number):string{
    return `${month} ${'timeline.months_future'}`;
  }

  formatMonth(value:any):string{

    if(typeof value==='number'){
      return `${value}`;
    }

    return value;
  }

  formatMoney(value:number):string{

    if(
      value===null ||
      value===undefined
    ){
      return '۰ تومان';
    }

    return(
      Number(value)
      .toLocaleString('fa-IR')
      +
      ' تومان'
    );

  }

}
