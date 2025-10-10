import { Component } from '@angular/core';
import { LoginService } from './SHARED/service/login.service';
import { DisableService } from './SHARED/service/disable.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'Escasan';

  public constructor(private _SrvLogin: LoginService, private Disable : DisableService){
    //this._SrvLogin.isLogin(false);
  }



  ngOnInit(){
    this.Disable.disable_DevTool();
     this.Disable.disable_RightClick();
     this.Disable.disable_Reload();
     this._SrvLogin.V_Version();
   }
  
}
