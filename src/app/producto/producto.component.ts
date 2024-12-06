import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../services/producto.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  standalone: false
})
export class ProductoComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'categoria', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Producto>([]);

  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.dataSource.data = productos;
      },
      error: () => {
        alert('Error al obtener los productos');
      }
    });
  }

  // Crear producto
  crearProducto(): void {
    const dialogRef = this.dialog.open(ProductoFormComponent, {
      width: '400px',
      data: { action: 'crear' } // Pasamos 'crear' para definir la acción en el formulario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Se añadió un nuevo producto, actualizamos la tabla sin hacer otra llamada
        this.dataSource.data = [...this.dataSource.data, result];
        alert('Producto creado');
        this.obtenerProductos();
      }
    });
  }

  // Entrada de producto
  entradaProducto(producto: Producto): void {
    const dialogRef = this.dialog.open(ProductoFormComponent, {
      width: '400px',
      data: { action: 'entrada', producto: producto } // Definimos 'entrada' como la acción
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizamos solo el producto modificado
        const updatedProducts = this.dataSource.data.map(p => p.id === result.id ? result : p);
        this.dataSource.data = updatedProducts;
        alert('Entrada registrada');
        this.obtenerProductos();
      }
    });
  }

  // Salida de producto
  salidaProducto(producto: Producto): void {
    const dialogRef = this.dialog.open(ProductoFormComponent, {
      width: '400px',
      data: { action: 'salida', producto: producto } // Definimos 'salida' como la acción
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizamos solo el producto modificado
        const updatedProducts = this.dataSource.data.map(p => p.id === result.id ? result : p);
        this.dataSource.data = updatedProducts;
        alert('Salida registrada');
        this.obtenerProductos();
      }
    });
  }

  // Eliminar producto
  eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe({
      next: (response) => {
        if (response.status === 204) {
          // Eliminamos el producto localmente de la tabla
          this.dataSource.data = this.dataSource.data.filter(p => p.id !== id);
          alert('Producto eliminado correctamente');
          this.obtenerProductos();
        } else {
          alert('Producto no encontrado o no se pudo eliminar');
        }
      },
      error: () => {
        alert('Error al eliminar el producto');
      }
    });
  }
}
