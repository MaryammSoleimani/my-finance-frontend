import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  TranslatePipe
} from '@ngx-translate/core';
import {
  PlansService
} from '../../../services/plans.service';

@Component({
  selector:'app-simulation-steps',
  standalone:true,
  imports:[
    CommonModule,
    TranslatePipe
  ],
  templateUrl:'./simulation-steps.html',
  styleUrl:'./simulation-steps.css'
})
export class SimulationSteps implements OnInit{

  private plansService=inject(PlansService);

  steps:any[]=[];

  showAll:boolean=false;

  ngOnInit():void{
    this.loadSteps();
  }

  loadSteps():void{
    this.plansService
    .getSimulationSteps()
    .subscribe({
      next:(data)=>{
        this.steps=data || [];
      },
      error:(err)=>{
        console.error(
          'Error loading simulation steps:',
          err
        );
      }
    });
  }

  get displayedSteps():any[]{
    return this.showAll
    ? this.steps
    : this.steps.slice(0,5);
  }

  toggleShowAll():void{
    this.showAll=!this.showAll;
  }

}
