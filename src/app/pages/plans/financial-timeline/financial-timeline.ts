import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

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

import { PlansService } from '../../../services/plans.service';


@Component({
  selector:'app-financial-timeline',
  standalone:true,
  imports:[
    CommonModule,
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


  ngOnInit():void{

    this.loadTimeline();

  }


  loadTimeline():void{

    this.plansService
    .getFinancialTimeline()
    .subscribe({

      next:(data)=>{

        this.prepareChart(data);

        this.cdr.detectChanges();

      },

      error:(err)=>{

        console.error(
          'خطا در دریافت نمودار مالی',
          err
        );

      }

    });

  }



  prepareChart(data:any):void{

    if(!data){
      return;
    }


    const categories =
      data.months ||
      data.labels ||
      [];



    this.eventList =
      data.events || [];



    this.chartOptions.series=[

      {
        name:'دارایی نقدشونده',

        data:
          data.liquid ||
          []
      },


      {
        name:'دارایی غیرنقدشونده',

        data:
          data.illiquid ||
          []
      }

    ];



    this.chartOptions.xaxis={

      categories:
        categories.map(
          (item:any)=>
          this.formatMonth(item)
        )

    };


  }





  runSimulation():void{

    this.loadTimeline();

  }





  getEventDate(month:number):string{

    return `${month} ماه آینده`;

  }





  formatMonth(value:any):string{

    if(typeof value === 'number'){

      return `ماه ${value}`;

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


    return (
      Number(value)
      .toLocaleString('fa-IR')
      +
      ' تومان'
    );

  }


}
