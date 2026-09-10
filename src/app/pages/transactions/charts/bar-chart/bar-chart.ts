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
  selector:'app-bar-chart',

  standalone:true,

  imports:[
    CommonModule,
    NgApexchartsModule,
    TranslatePipe
  ],

  templateUrl:'./bar-chart.html',

  styleUrls:[
    './bar-chart.css'
  ]
})
export class BarChart implements OnChanges {


  @Input()
  data:number[]=[];


  @Input()
  categories:string[]=[];


  @Input()
  colors:string[]=[];


  @Input()
  tooltipFormatter:any=null;



  chartOptions:any = {};



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


      series:[

        {

          name:this.translate.instant(
            'charts.expense'
          ),

          data:[]

        }

      ],




      chart:{


        type:'bar',

        height:320,

        width:'100%',


        background:'transparent',


        toolbar:{

          show:false

        },


        redrawOnParentResize:true,

        redrawOnWindowResize:true


      },






      plotOptions:{


        bar:{


          columnWidth:'65%',


          distributed:true,


          borderRadius:8,


          dataLabels:{


            position:'top'


          }


        }


      },






      dataLabels:{


        enabled:false


      },






      colors:[

        '#22c55e'

      ],






      xaxis:{


        categories:[],


        axisBorder:{


          show:false


        },


        labels:{


          style:{


            colors:'#a1a1aa'


          }


        }


      },






      yaxis:{


        labels:{


          style:{


            colors:'#a1a1aa'


          },


          formatter:(value:number)=>{


            return value

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


      },






      tooltip:{


        theme:'dark',


        y:{


          formatter:(value:number)=>{


            return value

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


      },







      grid:{


        borderColor:'#27272a',


        strokeDashArray:4


      }



    };


  }







  ngOnChanges(
    changes:SimpleChanges
  ){



    if(

      changes['data']

      ||

      changes['categories']

      ||

      changes['colors']

    ){



      this.chartOptions={


        ...this.chartOptions,





        series:[


          {


            name:this.translate.instant(
              'charts.expense'
            ),


            data:[

              ...this.data

            ]


          }


        ],






        xaxis:{


          ...this.chartOptions.xaxis,


          categories:[

            ...this.categories

          ]


        },






        colors:

        this.colors && this.colors.length

        ?

        this.colors

        :

        [

          '#22c55e'

        ]



      };



    }






    if(

      changes['tooltipFormatter']

      &&

      this.tooltipFormatter

    ){



      this.chartOptions.tooltip={


        ...this.chartOptions.tooltip,


        y:{


          formatter:this.tooltipFormatter


        }


      };



    }



  }



}
