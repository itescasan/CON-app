import { Component } from '@angular/core';
import { LoginService } from './SHARED/service/login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Escasan';

  public constructor(private _SrvLogin: LoginService){
    this._SrvLogin.isLogin();
  }
}
