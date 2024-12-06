export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: string;
    fechaCaducidad: Date;
    cantidadInicial: number;
    estado: string;
    precioUnitario: number;
    cantidadCambio: number;
  }
  