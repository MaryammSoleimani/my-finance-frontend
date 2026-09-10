import {
  Injectable,
  inject
} from '@angular/core';

import {
  TranslateService
} from '@ngx-translate/core';



@Injectable({

  providedIn:'root'

})
export class LanguageService {



  private translate =

  inject(TranslateService);





  currentLanguage:string = 'fa';







  constructor(){



    this.translate.addLangs([

      'fa',

      'en'

    ]);





    this.translate.setFallbackLang(

      'fa'

    );





    const savedLanguage =

    localStorage.getItem('language')

    ||

    'fa';





    this.changeLanguage(

      savedLanguage

    );



  }









  changeLanguage(lang:string){



    this.currentLanguage = lang;





    this.translate.use(lang)

    .subscribe({



      next:()=>{


        console.log(

          'Language loaded:',

          lang

        );


      },





      error:(err)=>{


        console.error(

          'Translation error:',

          err

        );


      }



    });







    localStorage.setItem(

      'language',

      lang

    );







    document.documentElement.lang =

    lang;







    document.documentElement.dir =



    lang === 'fa'


    ?


    'rtl'


    :


    'ltr';







    document.body.classList.remove(

      'fa',

      'en'

    );







    document.body.classList.add(

      lang

    );



  }









  getLanguage(){



    return this.currentLanguage;



  }









  isPersian(){



    return this.currentLanguage === 'fa';



  }



}
