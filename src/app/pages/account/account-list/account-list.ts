import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  TranslatePipe
} from '@ngx-translate/core';

import {
  AccountData
} from '../account.models';



@Component({

  selector:'app-account-list',

  standalone:true,

  imports:[

    CommonModule,

    TranslatePipe

  ],

  templateUrl:'./account-list.html',

  styleUrl:'./account-list.css'

})
export class AccountList {



  @Input()
  set assets(value:AccountData[]){

    this.assetsSignal.set(value || []);

  }




  @Input()
  set liabilities(value:AccountData[]){

    this.liabilitiesSignal.set(value || []);

  }





  @Output()
  deleteAccount =
  new EventEmitter<number>();




  @Output()
  editAccount =
  new EventEmitter<AccountData>();





  private assetsSignal =
  signal<AccountData[]>([]);



  private liabilitiesSignal =
  signal<AccountData[]>([]);



  private modalOpenSignal =
  signal<boolean>(false);



  private accountToDeleteSignal =
  signal<AccountData|null>(null);






  readonly displayedAssets =
  computed(()=>this.assetsSignal());



  readonly displayedLiabilities =
  computed(()=>this.liabilitiesSignal());



  readonly isModalOpen =
  computed(()=>this.modalOpenSignal());



  readonly accountToDelete =
  computed(()=>this.accountToDeleteSignal());







  openConfirm(account:AccountData){

    this.accountToDeleteSignal.set(account);

    this.modalOpenSignal.set(true);

  }







  closeModal(){

    this.modalOpenSignal.set(false);

    this.accountToDeleteSignal.set(null);

  }







  confirmDeletion(){

    const account =
    this.accountToDeleteSignal();



    if(account){

      this.deleteAccount.emit(account.id);

      this.closeModal();

    }

  }







  onEdit(account:AccountData){

    this.editAccount.emit(account);

  }



}
