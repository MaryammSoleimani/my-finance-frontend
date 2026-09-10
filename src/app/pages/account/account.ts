import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';

import {
  AccountSummary
} from './account-summary/account-summary';

import {
  AccountList
} from './account-list/account-list';

import {
  AccountChart
} from './account-chart/account-chart';

import {
  AddAccount
} from './add-account/add-account';

import {
  AccountService
} from '../../services/account.service';

import {
  AccountData
} from './account.models';

import {
  finalize
} from 'rxjs/operators';



@Component({

  selector:'app-account',

  standalone:true,

  imports:[

    CommonModule,

    TranslatePipe,

    AccountSummary,

    AccountList,

    AccountChart,

    AddAccount

  ],

  providers:[

    AccountService

  ],

  templateUrl:'./account.html',

  styleUrl:'./account.css'

})
export class Account implements OnInit {



  private accountService =
  inject(AccountService);



  private translate =
  inject(TranslateService);




  private assetsSignal =
  signal<AccountData[]>([]);



  private liabilitiesSignal =
  signal<AccountData[]>([]);



  private netWorthSignal =
  signal<number>(0);



  private totalAssetsSignal =
  signal<number>(0);



  private totalLiabilitiesSignal =
  signal<number>(0);



  private chartDataSignal =
  signal<any>({
    series:[],
    dates:[],
    colors:[]
  });



  private loadingSignal =
  signal<boolean>(false);



  private errorSignal =
  signal<string|null>(null);



  private currentPeriodSignal =
  signal<string>('1m');






  readonly assets =
  computed(()=>this.assetsSignal());



  readonly liabilities =
  computed(()=>this.liabilitiesSignal());



  readonly netWorth =
  computed(()=>this.netWorthSignal());



  readonly totalAssets =
  computed(()=>this.totalAssetsSignal());



  readonly totalLiabilities =
  computed(()=>this.totalLiabilitiesSignal());



  readonly chartData =
  computed(()=>this.chartDataSignal());



  readonly loading =
  computed(()=>this.loadingSignal());



  readonly error =
  computed(()=>this.errorSignal());



  readonly currentPeriod =
  computed(()=>this.currentPeriodSignal());







  showAddAccount=false;



  editingAccount:AccountData|null=null;






  periods=[

    {
      label:'account.periods.2w',
      value:'2w'
    },

    {
      label:'account.periods.1m',
      value:'1m'
    },

    {
      label:'account.periods.3m',
      value:'3m'
    },

    {
      label:'account.periods.1y',
      value:'1y'
    },

    {
      label:'account.periods.all',
      value:'all'
    }

  ];







  ngOnInit(){

    this.loadAccountData();

  }







  setPeriod(period:string){

    this.currentPeriodSignal.set(period);

    this.loadAccountData();

  }







  loadAccountData(period?:string){



    const selectedPeriod =

    period ||

    this.currentPeriodSignal();



    this.loadingSignal.set(true);


    this.errorSignal.set(null);





    this.accountService

    .getAccountSummary(selectedPeriod)

    .pipe(

      finalize(()=>{

        this.loadingSignal.set(false);

      })

    )

    .subscribe({



      next:(data:any)=>{


        if(!data)

          return;



        this.assetsSignal.set(

          data.assets || []

        );



        this.liabilitiesSignal.set(

          data.liabilities || []

        );



        this.netWorthSignal.set(

          data.net_worth || 0

        );



        this.totalAssetsSignal.set(

          data.total_assets || 0

        );



        this.totalLiabilitiesSignal.set(

          data.total_liabilities || 0

        );



        this.chartDataSignal.set(

          data.chart_data ||

          {
            series:[],
            dates:[],
            colors:[]
          }

        );


      },



      error:(err)=>{


        console.error(err);



        this.errorSignal.set(

          this.translate.instant(

            'account.errors.load'

          )

        );


      }



    });


  }







  deleteAccount(id:number){


    this.accountService

    .deleteAccount(id)

    .subscribe({



      next:()=>{

        this.loadAccountData();

      },



      error:(err)=>{


        console.error(err);



        this.errorSignal.set(

          this.translate.instant(

            'account.errors.delete'

          )

        );


      }


    });


  }







  onEditAccount(

    account:AccountData

  ){

    this.editingAccount=account;

    this.showAddAccount=true;

  }







  openAddAccount(){


    this.editingAccount=null;

    this.showAddAccount=true;


  }







  onCloseAddAccount(){


    this.showAddAccount=false;

    this.editingAccount=null;


  }



}
