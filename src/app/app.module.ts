import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProductoComponent } from './producto/producto.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { RouterModule, Routes } from '@angular/router'; 
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';


// Define las rutas de la aplicación
const routes: Routes = [
  { path: '', redirectTo: '/productos', pathMatch: 'full' },  // Ruta por defecto
  { path: 'productos', component: ProductoComponent },  // Ruta para el componente Producto
  { path: 'productos', component: ProductoFormComponent }  // Ruta para el componente Producto
];

@NgModule({
  declarations: [
    AppComponent,
    ProductoComponent,
    ProductoFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    AppRoutingModule, 
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule 
         
  ],
  providers: [],
  bootstrap: [AppComponent]  // Asegúrate de que tu componente principal esté aquí
})
export class AppModule { }
