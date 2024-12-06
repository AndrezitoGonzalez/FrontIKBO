import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../services/producto.service';  // Importar el servicio
import { Producto } from '../services/producto.service';  // Importar la interfaz Producto

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss'],
  standalone: false
})
export class ProductoFormComponent {
  action: 'entrada' | 'salida' | 'crear' | null = null;
  productoForm: FormGroup;  // Formulario reactivo
  producto: Producto;  // Propiedad producto


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: 'entrada' | 'salida' | 'crear', producto?: Producto },
    private productoService: ProductoService  // Inyectamos el servicio
  ) {
    // Inicializamos la propiedad 'producto' con los datos pasados o con valores vacíos
    this.producto = data.producto ? { ...data.producto } : { id: 0, nombre: '', descripcion: '', categoria: '', fechaCaducidad: '', cantidadInicial: 0, estado: '', precioUnitario: 0,cantidadCambio: 0 };

    // Inicializamos el formulario reactivo
    this.productoForm = this.fb.group({
      nombre: [this.producto.nombre, [Validators.required]],
      descripcion: [this.producto.descripcion, [Validators.required]],
      categoria: [this.producto.categoria, [Validators.required]],
      fechaCaducidad: [this.producto.fechaCaducidad, [Validators.required, this.fechaNoMenorQueHoy]],
      cantidadInicial: [this.producto.cantidadInicial, [Validators.required, Validators.min(0)]],
      precioUnitario: [this.producto.precioUnitario, [Validators.required, Validators.min(0)]],
      cantidadCambio: [, []],  // Quitamos validaciones para crear
    });

    // Establecemos la acción
    this.action = data.action;

    // Habilitamos o deshabilitamos campos dependiendo de la acción
    if (this.action === 'crear') {
      this.habilitarCamposCrear();
    } else if (this.action === 'entrada' || this.action === 'salida') {
      this.habilitarCamposEntradaSalida();
      this.productoForm.get('cantidadCambio')?.setValidators([Validators.required, Validators.min(1)]); // Activamos validación de cantidadCambio solo para entrada y salida
    }
  }

  // Método para cerrar el formulario sin guardar
  onCancel(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    //alert(this.action);
  }
  // Método para guardar el producto (llama a la API)
  onSave(): void {    
    if (this.productoForm.valid) {
      const producto: Producto = this.productoForm.value;  // Obtenemos los valores del formulario
      let nuevaCantidad = 0;
      // Si la acción es crear, lo creamos en la base de datos
      if (this.action === 'crear') {
        producto.estado = 'vigente';
        this.productoService.crearProducto(producto).subscribe({
          next: (id) => {
            producto.id = id;
            this.dialogRef.close(producto);
          },
          error: () => {
            alert('Error al crear el producto');
          }
        });
      } else {
        // Si es entrada o salida, actualizamos la cantidad

        // Convertir a número y verificar que los valores sean válidos
    let cantidadInicial = Number(this.producto.cantidadInicial);
    let cantidadCambio = Number(producto.cantidadCambio);
    // Verificamos si los valores son números válidos
    if (isNaN(cantidadInicial) || isNaN(cantidadCambio)) {
      alert('Por favor, ingrese cantidades válidas.');
      return; // Evitar continuar si los valores no son válidos
    }

        if (this.action === 'entrada') {
          // En el caso de entrada, sumamos la cantidad
          nuevaCantidad = Number(cantidadCambio) + Number(cantidadInicial);
          alert(nuevaCantidad);
        } else if (this.action === 'salida') {
          // En el caso de salida, restamos la cantidad
          nuevaCantidad = Number(cantidadCambio) + Number(cantidadInicial);

          // Si la cantidad resultante es menor a 0, mostramos una alerta
          if (nuevaCantidad < 0) {
            alert('No hay suficiente cantidad en stock para realizar la salida.');
            return;  // Evitamos continuar con la acción si la cantidad es negativa
          }
        }

        // Actualizamos la cantidad en el objeto producto
        producto.cantidadInicial = Number(nuevaCantidad);
        producto.estado = 'vigente';
        producto.id = this.producto.id;
        //console.log(producto)
        // Llamamos al servicio para actualizar el producto
        this.productoService.actualizarProducto(producto).subscribe({
          next: (resultado) => {
            if (resultado) {
              this.dialogRef.close(producto);
            } else {
              alert('No se pudo actualizar el producto');
            }
          },
          error: () => {
            alert('Error al actualizar el producto');
          }
        });
      }
    }
  }

  // Método para habilitar todos los campos para la creación
  habilitarCamposCrear(): void {
    const cantidadInicial = this.productoForm.get('cantidadInicial');
    const precioUnitario = this.productoForm.get('precioUnitario');
    const cantidadCambio = this.productoForm.get('cantidadCambio');


    // Habilitamos todos los campos de entrada
    if (cantidadInicial && precioUnitario && cantidadCambio) {
      cantidadInicial.enable();
      precioUnitario.enable();
      cantidadCambio.enable();  // Deshabilitar cantidadCambio para creación
    }
  }

  // Método para habilitar campos para Entrada o Salida
  habilitarCamposEntradaSalida(): void {
    const cantidadInicial = this.productoForm.get('cantidadInicial');
    const precioUnitario = this.productoForm.get('precioUnitario');
    const cantidadCambio = this.productoForm.get('cantidadCambio');

    // Habilitar o deshabilitar según la acción (entrada o salida)
    if (cantidadInicial && precioUnitario && cantidadCambio) {
      if (this.action === 'entrada') {
        // Si la acción es entrada, solo habilitar cantidad y precio
        cantidadInicial.disable();
        precioUnitario.enable();
        cantidadCambio.enable();  // Habilitar cantidadCambio para entrada
      } else if (this.action === 'salida') {
        // Si la acción es salida, deshabilitar cantidadInicial y precio
        cantidadInicial.disable();
        precioUnitario.disable();
        cantidadCambio.enable();  // Habilitar cantidadCambio para salida
      }
    }
  }

  // Validación para asegurarnos de que la fecha no sea menor que hoy
  fechaNoMenorQueHoy(control: any): { [key: string]: boolean } | null {
    const fecha = new Date(control.value);
    const hoy = new Date();
    if (fecha < hoy) {
      return { fechaNoMenorQueHoy: true };
    }
    return null;
  }
}
