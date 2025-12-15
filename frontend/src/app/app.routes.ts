import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { VentasComponent } from './component/ventas/ventas.component';
import { FacturaComponent } from './component/factura/factura.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'factura', component: FacturaComponent }
  ];