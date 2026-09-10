import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';
import {
  TranslatePipe
} from '@ngx-translate/core';
import {
  PlansService
} from '../../../services/plans.service';

@Component({
  selector:'app-events',
  standalone:true,
  imports:[
    CommonModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl:'./events.html',
  styleUrl:'./events.css'
})
export class Events implements OnInit{

  events:any[]=[];
  cashFlows:any[]=[];
  showModal=false;

  newEvent={
    name:'',
    amount:0,
    event_type:'income_change',
    month:1,
    cash_flow_id:null as number|null,
    description:''
  };

  isEditMode=false;
  editingId:number|null=null;

  eventTypes=[
    {
      value:'income_change',
      labelKey:'events.types.income_change'
    },
    {
      value:'expense_change',
      labelKey:'events.types.expense_change'
    },
    {
      value:'asset_transfer',
      labelKey:'events.types.asset_transfer'
    }
  ];

  constructor(
    private plansService:PlansService,
    private cdr:ChangeDetectorRef
  ){}

  ngOnInit(){
    this.loadData();
    this.loadCashFlows();
  }

  loadData(){
    this.plansService.getEvents()
    .subscribe({
      next:(data)=>{
        this.events=data||[];
        this.cdr.detectChanges();
      },
      error:(err)=>{
        console.error('Error loading events:',err);
      }
    });
  }

  loadCashFlows(){
    this.plansService.getCashFlows()
    .subscribe({
      next:(data)=>{
        this.cashFlows=data||[];
        this.cdr.detectChanges();
      },
      error:(err)=>{
        console.error('Error loading cash flows:',err);
      }
    });
  }

  onSubmit(){

    if(this.isEditMode && this.editingId){

      this.plansService.updateEvent(
        this.editingId,
        this.newEvent
      )
      .subscribe({
        next:()=>{
          this.loadData();
          this.closeModal();
        }
      });

      return;
    }

    this.plansService.addEvent(this.newEvent)
    .subscribe({
      next:()=>{
        this.loadData();
        this.closeModal();
      }
    });

  }

  onDelete(id:number){

    this.plansService.deleteEvent(id)
    .subscribe({
      next:()=>{
        this.loadData();
      }
    });

  }

  openModal(){
    this.showModal=true;
  }

  closeModal(){

    this.showModal=false;
    this.isEditMode=false;
    this.editingId=null;

    this.newEvent={
      name:'',
      amount:0,
      event_type:'income_change',
      month:1,
      cash_flow_id:null,
      description:''
    };

  }

  onEdit(event:any){

    this.isEditMode=true;
    this.editingId=event.id;
    this.newEvent={
      ...event
    };
    this.showModal=true;

  }

  getEventTypeLabel(type:string){

    const labels:any={
      income_change:'events.types.income_change',
      expense_change:'events.types.expense_change',
      asset_transfer:'events.types.asset_transfer'
    };

    return labels[type]||type;
  }

}
