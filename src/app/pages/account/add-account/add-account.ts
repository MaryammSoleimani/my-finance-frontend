import {
  Component,
  EventEmitter,
  Output,
  Input,
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
  AccountService
} from '../../../services/account.service';



@Component({

  selector:'app-add-account',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    TranslatePipe

  ],

  templateUrl:'./add-account.html',

  styleUrl:'./add-account.css'

})
export class AddAccount implements OnInit {



  @Input()
  account:any = null;



  @Output()
  close =
  new EventEmitter<void>();



  @Output()
  refresh =
  new EventEmitter<void>();






  name:string='';


  balance:number=0;


  color:string='#3b82f6';


  is_debt:boolean=false;


  type:string='account';






  accountTypes=[

    {
      value:'account',
      label:'account.types.account'
    },

    {
      value:'investment',
      label:'account.types.investment'
    },

    {
      value:'card',
      label:'account.types.card'
    }

  ];






  private accountService =

  inject(AccountService);



  private translate =

  inject(TranslateService);







  ngOnInit(){


    if(this.account){


      this.name =
      this.account.name;


      this.balance =
      this.account.balance;


      this.color =
      this.account.color;


      this.is_debt =
      this.account.is_debt;


      this.type =
      this.account.type;


    }


  }








  save(){



    const accountData={


      name:this.name,


      balance:this.balance,


      color:this.color,


      is_debt:this.is_debt,


      type:this.type


    };







    if(this.account){



      this.accountService

      .updateAccount(

        this.account.id,

        accountData

      )

      .subscribe({



        next:()=>{


          this.refresh.emit();

          this.close.emit();


        },



        error:(err)=>{


          console.error(

            this.translate.instant(
              'account.errors.update'
            ),

            err

          );


        }



      });



    }

    else {



      this.accountService

      .createAccount(accountData)

      .subscribe({



        next:()=>{


          this.refresh.emit();

          this.close.emit();


        },



        error:(err)=>{


          console.error(

            this.translate.instant(
              'account.errors.create'
            ),

            err

          );


        }



      });



    }



  }



}
