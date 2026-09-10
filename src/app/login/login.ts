import {
  Component
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';

import {
  AuthService
} from '../services/auth.services';

import {
  Router
} from '@angular/router';



@Component({

  selector: 'app-login',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    TranslatePipe

  ],

  templateUrl: './login.html',

  styleUrl: './login.css'

})
export class Login {



  mode: string = 'login';




  credentials = {

    username: '',

    password: ''

  };





  registerData = {

    username: '',

    email: '',

    password: '',

    confirmPassword: ''

  };





  errorMessage: string = '';






  constructor(

    private authService: AuthService,

    private router: Router,

    private translate: TranslateService

  ) {}









  onLogin() {



    this.errorMessage = '';




    this.authService

    .login(this.credentials)

    .subscribe({



      next: () => {



        this.router.navigate([

          '/home'

        ]);



      },





      error: (err) => {



        this.errorMessage =

        this.translate.instant(

          'auth.errors.invalid_login'

        );



        console.error(err);



      }



    });



  }









  onRegister() {



    this.errorMessage = '';






    if (

      this.registerData.password !==

      this.registerData.confirmPassword

    ) {



      this.errorMessage =

      this.translate.instant(

        'auth.errors.password_match'

      );



      return;



    }









    this.authService

    .register({



      username:

      this.registerData.username,



      email:

      this.registerData.email,



      password:

      this.registerData.password



    })

    .subscribe({





      next: () => {



        this.router.navigate([

          '/home'

        ]);



      },







      error: (err) => {



        this.errorMessage =

        err.error?.error

        ||

        this.translate.instant(

          'auth.errors.register'

        );



        console.error(err);



      }



    });



  }









  switchMode(mode: string) {



    this.mode = mode;


    this.errorMessage = '';



  }



}
