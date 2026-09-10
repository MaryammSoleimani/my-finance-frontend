import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  TranslatePipe
} from '@ngx-translate/core';

import {
  Assets
} from './assets/assets';

import {
  CashFlow
} from './cash-flow/cash-flow';

import {
  Events
} from './events/events';

import {
  SimulationSummary
} from './simulation-summary/simulation-summary';

import {
  FinancialTimeline
} from './financial-timeline/financial-timeline';

import {
  SimulationSteps
} from './simulation-steps/simulation-steps';



@Component({

  selector:'app-plans',

  standalone:true,

  imports:[

    CommonModule,

    TranslatePipe,

    Assets,

    CashFlow,

    Events,

    SimulationSummary,

    FinancialTimeline,

    SimulationSteps

  ],

  templateUrl:'./plans.html',

  styleUrl:'./plans.css'

})
export class Plans implements OnInit {



  username:string='';





  ngOnInit(){



    const storedUser =

    localStorage.getItem(

      'username'

    );





    this.username =

    storedUser

    ?

    storedUser

    :

    'Guest';



  }



}
