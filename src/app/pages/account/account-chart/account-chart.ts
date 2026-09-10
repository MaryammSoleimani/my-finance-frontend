import {
  Component,
  Input,
  OnChanges,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';

import {
  NgApexchartsModule
} from 'ng-apexcharts';



@Component({

  selector:'app-account-chart',

  standalone:true,

  imports:[

    CommonModule,

    NgApexchartsModule,

    TranslatePipe

  ],

  templateUrl:'./account-chart.html',

  styleUrl:'./account-chart.css'

})
export class AccountChart implements OnChanges {



  @Input()
  data:any;





  chartOptions:any = {

    series:[],

    chart:{

      type:'area',

      height:350,

      toolbar:{

        show:false

      },

      animations:{

        enabled:true

      },

      fontFamily:'inherit',

      background:'transparent'

    },


    dataLabels:{

      enabled:false

    },


    stroke:{

      curve:'smooth',

      width:3

    },


    fill:{

      type:'gradient',

      gradient:{

        shadeIntensity:1,

        opacityFrom:.45,

        opacityTo:.05,

        stops:[20,100]

      }

    },


    colors:[],


    legend:{

      position:'top',

      horizontalAlign:'right'

    },


    tooltip:{

      theme:'dark',

      y:{

        formatter:(value:number)=>{


          return (

            value.toLocaleString()

            +

            ' '

            +

            this.translate.instant(

              'currency.symbol'

            )

          );


        }

      }

    },


    yaxis:{

      labels:{

        formatter:(value:number)=>{

          if(value >= 1000000){

            return (

              (value / 1000000)

              .toFixed(1)

              +

              'M'

            );

          }



          if(value >=1000){

            return (

              (value / 1000)

              .toFixed(0)

              +

              'K'

            );

          }



          return value.toLocaleString();

        }

      }

    }


  };





  xaxis:any = {

    categories:[]

  };






  private translate =

  inject(TranslateService);







  ngOnChanges(){


    if(this.data){

      this.updateChart();

    }


  }







  updateChart(){



    this.chartOptions.series =

    this.data.series || [];





    this.chartOptions.colors =

    this.data.colors || [];





    this.xaxis = {


      categories:

      this.data.dates || [],



      labels:{

        rotate:-45

      }

    };



  }



}
