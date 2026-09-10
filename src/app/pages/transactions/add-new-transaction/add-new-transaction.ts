import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TransactionService } from '../../../services/transaction.service';


@Component({
  selector:'app-add-new-transaction',
  standalone:true,
  imports:[
    CommonModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl:'./add-new-transaction.html',
  styleUrls:[
    './add-new-transaction.css'
  ]
})
export class AddNewTransaction implements OnInit {


  @Output() close =
  new EventEmitter<void>();


  @Output() saved =
  new EventEmitter<void>();


  categories:any[]=[];


  accounts:any[]=[];


  newData={

    date:new Date()
    .toISOString()
    .split('T')[0],

    amount:null,

    desc:'',

    kind:'expense',

    account:null,

    category:null

  };


  errorMessage:string='';



  constructor(
    private http:HttpClient,
    private cdr:ChangeDetectorRef,
    private transactionService:TransactionService,
    private translate:TranslateService
  ){}



  ngOnInit(){

    this.loadDropdownData();

  }



  loadDropdownData(){

    this.http
    .get<any[]>('http://127.0.0.1:8000/api/categories/')
    .subscribe({

      next:(data)=>{

        this.categories =
        data && data.length
        ? data
        : this.getDefaultCategories();

        this.cdr.detectChanges();

      },

      error:()=>{

        this.categories =
        this.getDefaultCategories();

        this.cdr.detectChanges();

      }

    });



    this.http
    .get<any[]>('http://127.0.0.1:8000/api/accounts/')
    .subscribe({

      next:(data)=>{

        this.accounts=data;

        this.cdr.detectChanges();

      },

      error:()=>{

        this.accounts=[];

      }

    });

  }



  private getDefaultCategories(){

    return [

      {
        id:1,
        name:this.translate.instant('transaction_form.daily_purchase')
      },

      {
        id:2,
        name:this.translate.instant('transaction_form.travel')
      },

      {
        id:3,
        name:this.translate.instant('transaction_form.fuel')
      },

      {
        id:4,
        name:this.translate.instant('transaction_form.insurance')
      },

      {
        id:5,
        name:this.translate.instant('transaction_form.other')
      }

    ];

  }



  save(){

    this.errorMessage='';


    let emptyFields:string[]=[];


    if(!this.newData.amount)
      emptyFields.push(
        this.translate.instant('transaction_form.amount')
      );


    if(!this.newData.desc)
      emptyFields.push(
        this.translate.instant('transaction_form.description')
      );


    if(!this.newData.account)
      emptyFields.push(
        this.translate.instant('transaction_form.account')
      );


    if(!this.newData.category)
      emptyFields.push(
        this.translate.instant('transaction_form.category')
      );



    if(emptyFields.length){

      this.errorMessage =
      this.translate.instant(
        'transaction_form.fill_required'
      )
      +
      emptyFields.join('، ');


      return;

    }



    const payload={

      ...this.newData,

      amount:Number(this.newData.amount),

      account:Number(this.newData.account),

      category:Number(this.newData.category)

    };



    this.transactionService
    .createTransaction(payload)
    .subscribe({

      next:()=>{

        this.saved.emit();

        this.close.emit();

      },


      error:()=>{

        this.errorMessage =
        this.translate.instant(
          'transaction_form.server_error'
        );

      }

    });


  }


}
