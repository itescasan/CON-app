import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { faCoffee, fas, faWarehouse } from '@fortawesome/free-solid-svg-icons';

import { SidebarComponent } from '../SHARED/componente/sidebar/sidebar.component';
import { LoginComponent } from '../SHARED/componente/login/login.component';
import { DynamicFormDirective } from '../SHARED/directive/dynamic-form.directive';
import { DialogErrorComponent } from '../SHARED/componente/dialog-error/dialog-error.component';
import { IgxComboModule } from 'igniteui-angular';
import { IgxIconModule } from 'igniteui-angular';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { WaitComponent } from '../SHARED/componente/wait/wait.component';
import { AnularComponent } from '../SHARED/anular/anular.component';

import { CatalogoCuentaComponent } from './Contabilidad/catalogo-cuenta/nuevo-catalogo-cuenta/catalogo-cuenta.component';
import { IConfig, NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { RegistroCatalogoCuentaComponent } from './Contabilidad/catalogo-cuenta/registro-catalogo-cuenta/registro-catalogo-cuenta.component';
import { EjercicioFiscalComponent } from './Contabilidad/ejercicio-fiscal/nuevo-ejercicio-fiscal/ejercicio-fiscal.component';
import { RegistroEjercicioFiscalComponent } from './Contabilidad/ejercicio-fiscal/registro-ejercicio-fiscal/registro-ejercicio-fiscal.component';
import { PeriodosFiscalComponent } from './Contabilidad/ejercicio-fiscal/periodos-fiscal/periodos-fiscal.component';
import {MatTableModule} from '@angular/material/table';
import { CustomMatPaginatorIntl } from 'src/SHARED/class/CustomMatPaginatorIntl ';

@NgModule({
  declarations: [
    AppComponent,
    WaitComponent,
    SidebarComponent,
    LoginComponent,
    DynamicFormDirective,
    DialogErrorComponent,
    AnularComponent,
    EjercicioFiscalComponent,
    CatalogoCuentaComponent,
    RegistroCatalogoCuentaComponent,
    RegistroEjercicioFiscalComponent,
    PeriodosFiscalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    FontAwesomeModule,
    MatDialogModule,
    MatIconModule,
    IgxComboModule,
    IgxIconModule,
    MatPaginatorModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatTableModule
  ],
  providers: [
    provideNgxMask(),
     { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faCoffee);
  }
  
}

