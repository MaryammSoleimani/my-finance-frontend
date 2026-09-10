import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';

import {
  AnalyticsService
} from '../../services/analytics.service';



@Component({

  selector:'app-analytics',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    TranslatePipe

  ],

  templateUrl:'./analytics.html',

  styleUrls:[

    './analytics.css'

  ]

})
export class Analytics implements OnInit {



  healthScore:any = null;


  healthScoreLoading:boolean = false;



  anomalyAlerts:any[] = [];



  smartGoal:any = null;



  goalAmount:number|null = null;


  goalMonths:number|null = null;





  private analyticsService =

  inject(AnalyticsService);



  private translate =

  inject(TranslateService);






  ngOnInit(){


    this.loadAnomalyAlerts();


  }







  loadHealthScore(){


    this.healthScoreLoading=true;



    this.analyticsService

    .getHealthScore()

    .subscribe({



      next:(response:any)=>{


        this.healthScore=response;


        this.healthScoreLoading=false;


      },



      error:()=>{


        this.healthScoreLoading=false;


      }


    });


  }








  loadAnomalyAlerts(){


    this.analyticsService

    .getAnomalyAlerts()

    .subscribe({



      next:(response:any)=>{


        this.anomalyAlerts =

        response.alerts || [];



      },



      error:()=>{


        this.anomalyAlerts=[];


      }


    });


  }








  calculateGoal(){



    if(

      !this.goalAmount ||

      !this.goalMonths

    ){

      return;

    }





    this.analyticsService

    .calculateSmartGoal(

      this.goalAmount,

      this.goalMonths

    )

    .subscribe({



      next:(response:any)=>{


        this.smartGoal=response;


      }



    });



  }








  getScoreColor(score:number){


    if(score >= 80)

      return '#22c55e';



    if(score >= 50)

      return '#eab308';



    return '#ef4444';


  }








  getStatusColor(status:string){


    switch(status){


      case 'good':

        return '#22c55e';



      case 'warning':

        return '#eab308';



      case 'bad':

        return '#ef4444';



      default:

        return '#71717a';


    }


  }








  getStatusIcon(status:string){


    switch(status){


      case 'good':

        return '✓';



      case 'warning':

        return '!';



      case 'bad':

        return '×';



      default:

        return '-';


    }


  }








  formatLabel(key:string){



    const labels:any={


      income:'analytics.labels.income',


      expenses:'analytics.labels.expenses',


      expense:'analytics.labels.expense',


      savings:'analytics.labels.savings',


      saving:'analytics.labels.savings',


      debt:'analytics.labels.debt',


      debts:'analytics.labels.debts',


      assets:'analytics.labels.assets',


      balance:'analytics.labels.balance',


      investment:'analytics.labels.investment',


      cash_flow:'analytics.labels.cash_flow'


    };





    return labels[key]

    ?

    this.translate.instant(labels[key])

    :

    key.replace(/_/g,' ');



  }








  getRiskTitle(level:string){



    switch(level){



      case 'low':

        return this.translate.instant(

          'analytics.risk.low'

        );





      case 'medium':

        return this.translate.instant(

          'analytics.risk.medium'

        );





      case 'high':

        return this.translate.instant(

          'analytics.risk.high'

        );





      default:

        return this.translate.instant(

          'analytics.risk.unknown'

        );


    }


  }








  getRiskIcon(level:string){


    switch(level){



      case 'low':

        return '🟢';



      case 'medium':

        return '🟡';



      case 'high':

        return '🔴';



      default:

        return '⚪';


    }


  }








  formatMoney(value:number){


    if(!value)

      return (

        '0 '

        +

        this.translate.instant(

          'currency.symbol'

        )

      );





    return (

      value.toLocaleString(

        this.translate.currentLang()==='fa'

        ?

        'fa-IR'

        :

        'en-US'

      )

      +

      ' '

      +

      this.translate.instant(

        'currency.symbol'

      )

    );


  }



}
