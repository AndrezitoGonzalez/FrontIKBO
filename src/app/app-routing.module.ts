// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoComponent } from './producto/producto.component';  // Asegúrate de importar el componente correcto

const routes: Routes = [
  { path: 'productos', component: ProductoComponent },  // Definir la ruta para productos
  { path: '', redirectTo: '/productos', pathMatch: 'full' }  // Redirige al inicio a la ruta de productos
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
