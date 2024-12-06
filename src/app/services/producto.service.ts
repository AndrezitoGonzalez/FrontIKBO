import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

// Define la interfaz de Producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  fechaCaducidad: string;
  cantidadInicial: number;
  estado: string;
  precioUnitario: number;
  cantidadCambio: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'https://localhost:7256/api/Productos'; // URL base de las APIs

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/ObtenerProducto`);
  }

  // Crear un nuevo producto
  crearProducto(producto: Producto): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/CrearProducto`, producto);
  }

  // Actualizar un producto
  actualizarProducto(producto: Producto): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.apiUrl}/ActualizarProducto/${producto.id}`, producto, {
      observe: 'response' 
    });
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<HttpResponse<boolean>> {
    return this.http.delete<boolean>(`${this.apiUrl}/EliminarProducto/${id}`, { observe: 'response' });
  }
}
