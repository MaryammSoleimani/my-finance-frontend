import {
  Component,
  OnInit,
  ChangeDetectorRef,
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
  BudgetService
} from '../../services/budget.service';

import {
  AddBudget
} from './add-budget/add-budget';



@Component({

  selector:'app-budget',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    AddBudget,

    TranslatePipe

  ],

  templateUrl:'./budget.html',

  styleUrl:'./budget.css'

})
export class Budget implements OnInit {



  budgets:any[]=[];


  summary:any=null;


  showAddBudget=false;


  period:string='monthly';




  private budgetService =
  inject(BudgetService);



  private cdr =
  inject(ChangeDetectorRef);



  private translate =
  inject(TranslateService);






  ngOnInit():void{

    this.loadData();

  }






  private loadData():void{


    this.loadBudgets();


    this.loadSummary();


  }







  private loadBudgets():void{


    this.budgetService

    .getBudgets()

    .subscribe({


      next:(data)=>{


        this.budgets =

        Array.isArray(data)

        ?

        data

        :

        [];



        this.cdr.detectChanges();


      },



      error:(err)=>{


        console.error(

          this.translate.instant(
            'budget.errors.load_budgets'
          ),

          err

        );



        this.budgets=[];


      }


    });


  }







  private loadSummary():void{


    this.budgetService

    .getSummary(this.period)

    .subscribe({


      next:(data)=>{


        this.summary=data || null;



        this.cdr.detectChanges();


      },



      error:(err)=>{


        console.error(

          this.translate.instant(
            'budget.errors.load_summary'
          ),

          err

        );



        this.summary=null;


      }


    });


  }







  setPeriod(

    period:string

  ):void{


    if(this.period===period){

      return;

    }



    this.period=period;



    this.loadSummary();


  }







  onAddBudget():void{


    this.showAddBudget=true;


  }







  onCloseAddBudget():void{


    this.showAddBudget=false;


  }







  onBudgetSaved():void{


    this.showAddBudget=false;


    this.loadData();


  }







  getProgressColor(

    percentage:number

  ):string{


    if(percentage < 50){

      return '#10b981';

    }



    if(percentage < 80){

      return '#f59e0b';

    }



    if(percentage < 100){

      return '#f97316';

    }



    return '#ef4444';


  }



}
