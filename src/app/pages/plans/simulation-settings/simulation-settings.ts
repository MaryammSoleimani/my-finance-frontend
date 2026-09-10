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
  FormsModule
} from '@angular/forms';
import {
  TranslatePipe
} from '@ngx-translate/core';
import {
  PlansService
} from '../../../services/plans.service';

@Component({
  selector:'app-simulation-settings',
  standalone:true,
  imports:[
    CommonModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl:'./simulation-settings.html',
  styleUrl:'./simulation-settings.css'
})
export class SimulationSettings implements OnInit{

  private plansService=inject(PlansService);

  private settingsSignal=signal<any>({
    start_date:'',
    end_date:'',
    initial_cash:0,
    monthly_income:0,
    monthly_expenses:0
  });

  private showSettingsSignal=signal<boolean>(false);

  readonly settings=computed(()=>
    this.settingsSignal()
  );

  readonly showSettings=computed(()=>
    this.showSettingsSignal()
  );

  ngOnInit():void{
    this.loadSettings();
  }

  loadSettings():void{
    this.plansService
    .getSimulationSettings()
    .subscribe({
      next:(data)=>{
        this.settingsSignal.set(
          data || {
            start_date:'',
            end_date:'',
            initial_cash:0,
            monthly_income:0,
            monthly_expenses:0
          }
        );
      },
      error:(err)=>{
        console.error(
          'Error loading simulation settings:',
          err
        );
      }
    });
  }

  openSettings():void{
    this.showSettingsSignal.set(true);
  }

  closeSettings():void{
    this.showSettingsSignal.set(false);
  }

  saveSettings():void{
    this.plansService
    .updateSimulationSettings(
      this.settings()
    )
    .subscribe({
      next:()=>{
        this.closeSettings();
        this.loadSettings();
      },
      error:(err)=>{
        console.error(
          'Error saving simulation settings:',
          err
        );
      }
    });
  }

}
