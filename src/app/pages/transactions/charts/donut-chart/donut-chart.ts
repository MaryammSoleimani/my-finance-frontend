import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { NgApexchartsModule } from 'ng-apexcharts';

import {
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';



@Component({
  selector:'app-donut-chart',

  standalone:true,

  imports:[
    CommonModule,
    NgApexchartsModule,
    TranslatePipe
  ],

  templateUrl:'./donut-chart.html',

  styleUrls:[
    './donut-chart.css'
  ]
})
export class DonutChart implements OnChanges {


  @Input()
  series:number[]=[];


  @Input()
  labels:string[]=[];


  @Input()
  colors:string[]=[];


  @Input()
  centerText:string='';


  @Input()
  centerSubText:string='';



  chartOptions:any={};



  constructor(
    private translate:TranslateService
  ){

    this.initChart();

  }



  get locale(){

    return this.translate.currentLang() === 'fa'
    ? 'fa-IR'
    : 'en-US';

  }



  initChart(){

    this.chartOptions={

      chart:{
        type:'donut',
        height:320,
        width:'100%'
      },


      plotOptions:{

        pie:{

          donut:{

            size:'75%',


            labels:{

              show:true,


              total:{

                show:true,


                label:this.translate.instant(
                  'charts.total'
                ),



                formatter:(w:any)=>{


                  return w.globals.seriesTotals

                  .reduce(
                    (a:number,b:number)=>a+b,
                    0
                  )

                  .toLocaleString(
                    this.locale
                  )

                  +' '

                  +

                  this.translate.instant(
                    'currency.symbol'
                  );


                }


              }


            }


          }


        }


      },



      noData:{

        text:this.translate.instant(
          'charts.no_data'
        )

      }


    };

  }





  ngOnChanges(
    changes:SimpleChanges
  ){


    if(

      changes['series']

      ||

      changes['labels']

      ||

      changes['colors']

    ){


      this.chartOptions={

        ...this.chartOptions,


        labels:[
          ...this.labels
        ],


        colors:

        this.colors.length

        ?

        this.colors

        :

        undefined


      };


    }


  }


}
