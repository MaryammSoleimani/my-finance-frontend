import {
  Component,
  OnInit,
  ChangeDetectorRef
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
  ConfigurationService
} from '../../services/configuration.service';



@Component({

  selector:'app-configuration',

  standalone:true,

  imports:[

    CommonModule,

    FormsModule,

    TranslatePipe

  ],

  templateUrl:'./configuration.html',

  styleUrl:'./configuration.css'

})

export class Configuration implements OnInit {



  categories:any[]=[];


  showAddCategory=false;


  editingCategory:any=null;


  isSubmitting=false;



  categoryForm={

    name:'',

    color:'#3b82f6'

  };



  showDeleteModal=false;


  categoryToDelete:any=null;



  usageCount:any={

    transaction_count:0,

    budget_count:0,

    total_count:0

  };





  notificationPrefs:any={

    budget_alerts:true,

    budget_threshold:80,

    spending_alerts:true,

    goal_reminders:true

  };





  constructor(

    private configService:ConfigurationService,

    private cdr:ChangeDetectorRef,

    private translate:TranslateService

  ){}





  ngOnInit(){

    this.loadCategories();

    this.loadNotificationPreferences();

  }






  loadCategories(){


    this.configService

    .getCategories()

    .subscribe({


      next:(data)=>{


        this.categories=data || [];


        this.cdr.detectChanges();


      },


      error:(err)=>{


        console.error(

          this.translate.instant(
            'configuration.errors.load_categories'
          ),

          err

        );


        this.categories=[];


      }


    });


  }






  onAddCategory(){


    this.editingCategory=null;


    this.categoryForm={

      name:'',

      color:'#3b82f6'

    };


    this.showAddCategory=true;


  }






  onEditCategory(category:any){


    this.editingCategory=category;


    this.categoryForm={

      name:category.name,

      color:category.color || '#3b82f6'

    };


    this.showAddCategory=true;


  }







  saveCategory(){


    if(!this.categoryForm.name.trim()){

      return;

    }



    this.isSubmitting=true;



    const data={

      name:this.categoryForm.name,

      color:this.categoryForm.color

    };



    const request = this.editingCategory

    ?

    this.configService.updateCategory(

      this.editingCategory.id,

      data

    )

    :

    this.configService.createCategory(data);





    request.subscribe({


      next:()=>{


        this.isSubmitting=false;

        this.showAddCategory=false;

        this.loadCategories();


      },


      error:(err)=>{


        console.error(

          this.translate.instant(
            'configuration.errors.save_category'
          ),

          err

        );


        this.isSubmitting=false;


      }


    });


  }








  onDeleteCategory(category:any){


    this.categoryToDelete=category;



    this.configService

    .getCategoryUsage(category.id)

    .subscribe({


      next:(data)=>{


        this.usageCount=data;


        this.showDeleteModal=true;


      },


      error:()=>{


        this.usageCount={

          transaction_count:0,

          budget_count:0,

          total_count:0

        };


        this.showDeleteModal=true;


      }


    });


  }






  confirmDelete(){


    if(!this.categoryToDelete){

      return;

    }



    this.configService

    .deleteCategory(

      this.categoryToDelete.id

    )

    .subscribe({


      next:()=>{


        this.showDeleteModal=false;


        this.categoryToDelete=null;


        this.loadCategories();


      },


      error:(err)=>{


        console.error(

          this.translate.instant(
            'configuration.errors.delete_category'
          ),

          err

        );


      }


    });


  }






  cancelDelete(){

    this.showDeleteModal=false;

    this.categoryToDelete=null;

  }








  loadNotificationPreferences(){


    this.configService

    .getNotificationPreferences()

    .subscribe({


      next:(data)=>{


        this.notificationPrefs={

          ...this.notificationPrefs,

          ...data

        };


      },


      error:(err)=>{


        console.error(

          this.translate.instant(
            'configuration.errors.load_notifications'
          ),

          err

        );


      }


    });


  }







  onTogglePreference(

    key:string,

    value:boolean

  ){


    this.notificationPrefs[key]=value;


    this.saveNotificationPreferences();


  }







  onChangeThreshold(value:number){


    this.notificationPrefs.budget_threshold=value;


    this.saveNotificationPreferences();


  }







  saveNotificationPreferences(){


    this.configService

    .updateNotificationPreferences(

      this.notificationPrefs

    )

    .subscribe({


      error:(err)=>{


        console.error(

          this.translate.instant(
            'configuration.errors.save_notifications'
          ),

          err

        );


      }


    });


  }



}
