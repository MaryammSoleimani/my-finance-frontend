import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector:'app-transaction-sidebar',
  standalone:true,
  imports:[
    CommonModule,
    TranslatePipe
  ],
  templateUrl:'./transaction-sidebar.html',
  styleUrl:'./transaction-sidebar.css'
})
export class TransactionSidebar implements OnInit {

  @Output() filterChanged = new EventEmitter<string>();

  @Output() categoryChanged = new EventEmitter<string>();

  menus:any={
    month:true,
    day:false,
    year:false,
    misc:false,
    budget:false
  };

  activeView='current-month';

  selectedCat='';

  showAdvancedFilters=false;

  categories:any[]=[];

  showAllCategories=false;

  months=[
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  selectedMonths:string[]=[];

  showAllMonths=false;

  years:string[]=[
    '2023',
    '2024',
    '2025',
    '2026'
  ];

  selectedYears:string[]=[];



  constructor(
    private transactionService:TransactionService
  ){}



  ngOnInit(){

    this.loadCategories();

    this.loadYears();

  }



  loadCategories(){

    this.transactionService
    .getCategories()
    .subscribe({

      next:(data)=>{

        this.categories=data;

      },

      error:(err)=>{

        console.error(
          'Error fetching categories:',
          err
        );

      }

    });

  }



  loadYears(){

    this.transactionService
    .getTransactionYears()
    .subscribe({

      next:(data)=>{

        this.years =
        data.map(
          year=>year.toString()
        );

      },

      error:(err)=>{

        console.error(err);

        this.years=[
          '2023',
          '2024',
          '2025',
          '2026'
        ];

      }

    });

  }



  get visibleMonths(){

    return this.showAllMonths
    ? this.months
    : this.months.slice(0,6);

  }



  get visibleCategories(){

    return this.showAllCategories
    ? this.categories
    : this.categories.slice(0,6);

  }



  toggleMenu(
    menuName:string
  ){

    this.menus[menuName]=
    !this.menus[menuName];

  }



  toggleAdvancedFilters(){

    this.showAdvancedFilters =
    !this.showAdvancedFilters;

  }



  selectView(
    view:string
  ){

    this.activeView=view;

    this.filterChanged.emit(view);

    this.selectedCat='';

  }



  selectCategory(
    category:string
  ){

    this.selectedCat=category;

    this.categoryChanged.emit(category);

  }



  clearCategoryFilter(){

    this.selectedCat='';

    this.categoryChanged.emit('');

  }



  selectAllCategories(){

    this.selectedCat='all';

    this.categoryChanged.emit('all');

  }



  toggleMonth(
    month:string
  ){

    if(this.selectedMonths.includes(month)){

      this.selectedMonths =
      this.selectedMonths.filter(
        m=>m!==month
      );

    }
    else{

      this.selectedMonths.push(month);

    }

  }



  clearMonthFilter(){

    this.selectedMonths=[];

  }



  toggleYear(
    year:string
  ){

    if(this.selectedYears.includes(year)){

      this.selectedYears =
      this.selectedYears.filter(
        y=>y!==year
      );

    }
    else{

      this.selectedYears.push(year);

    }

  }



  clearYearFilter(){

    this.selectedYears=[];

  }

}
