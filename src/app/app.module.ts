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
import {MatMenuModule} from '@angular/material/menu';

import { faCoffee, fas, faWarehouse } from '@fortawesome/free-solid-svg-icons';

import { SidebarComponent } from './SHARED/componente/sidebar/sidebar.component';
import { LoginComponent } from './SHARED/componente/login/login.component';
import { DynamicFormDirective } from './SHARED/directive/dynamic-form.directive';
import { DialogErrorComponent } from './SHARED/componente/dialog-error/dialog-error.component';
import { IgxComboModule } from 'igniteui-angular';
import { IgxIconModule } from 'igniteui-angular';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { WaitComponent } from './SHARED/componente/wait/wait.component';
import { AnularComponent } from './SHARED/anular/anular.component';

import { CatalogoCuentaComponent } from './Contabilidad/catalogo-cuenta/nuevo-catalogo-cuenta/catalogo-cuenta.component';
import { IConfig, NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { RegistroCatalogoCuentaComponent } from './Contabilidad/catalogo-cuenta/registro-catalogo-cuenta/registro-catalogo-cuenta.component';
import { EjercicioFiscalComponent } from './Contabilidad/ejercicio-fiscal/nuevo-ejercicio-fiscal/ejercicio-fiscal.component';
import { RegistroEjercicioFiscalComponent } from './Contabilidad/ejercicio-fiscal/registro-ejercicio-fiscal/registro-ejercicio-fiscal.component';
import {MatTableModule} from '@angular/material/table';
import { CustomMatPaginatorIntl } from 'src/app/SHARED/class/CustomMatPaginatorIntl ';
import { DialogoConfirmarComponent } from './SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { AsientoContableComponent } from './Contabilidad/asiento-contable/nuevo-asiento-contable/asiento-contable/asiento-contable.component';
import { RegistroAsientoContableComponent } from './Contabilidad/asiento-contable/registro-asiento-contable/registro-asiento-contable.component';
import { AuxiliarCuentaComponent } from './Contabilidad/auxiliar-cuenta/auxiliar-cuenta.component';
import {CdkDrag} from '@angular/cdk/drag-drop';
import { TransferenciaCuentaComponent } from './Contabilidad/Operaciones-bancarias/transferencia-cuenta/transferencia-cuenta.component';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { RegistroTrasnferenciaComponent } from './Contabilidad/Operaciones-bancarias/registro-trasnferencia/registro-trasnferencia.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NuevoChequeComponent } from './nuevo-cheque/nuevo-cheque.component';
import { RegistroChequesComponent } from './registro-cheques/registro-cheques.component';
import { TransferenciaSaldoComponent } from './Contabilidad/Operaciones-bancarias/transferencia-saldo/transferencia-saldo.component';

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
    DialogoConfirmarComponent,
    AsientoContableComponent,
    RegistroAsientoContableComponent,
    AuxiliarCuentaComponent,
    TransferenciaCuentaComponent,
    RegistroTrasnferenciaComponent,
    NuevoChequeComponent,
    RegistroChequesComponent,
    TransferenciaSaldoComponent
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
    MatMenuModule,
    MatPaginatorModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatTableModule,
    CdkDrag,
    BackButtonDisableModule.forRoot({
      preserveScroll: true // DISABLE BACK
    })
  ],
  providers: [
    provideNgxMask(),
     { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
     { provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faCoffee);
  }
  
}

