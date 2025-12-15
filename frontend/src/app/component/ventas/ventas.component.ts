import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { VentaService } from '../../services/venta.service';
import { FacturaService } from '../../services/factura.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class VentasComponent implements OnInit {
  products: any[] = [];
  errorMessage: string = '';

  idCliente: number | null = null;
  idProducto: number | null = null;
  cantidad: number | null = null;

  constructor(
    private productService: ProductService,
    private ventaService: VentaService,
    private facturaService: FacturaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.errorMessage = '';
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.data;
      },
      error: (error: any) => {
        console.error('Error al obtener productos:', error);
        this.errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';
      }
    });
  }

  vender() {
    this.errorMessage = '';
    if (!this.idCliente || !this.idProducto || !this.cantidad) {
      this.errorMessage = 'Ingresa Id de cliente, Id de producto y cantidad.';
      return;
    }

    const payload = {
      Id_Cliente: this.idCliente,
      Detalles: [{ Id_Producto: this.idProducto, Cantidad: this.cantidad }]
    };

    this.ventaService.crearVenta(payload).subscribe({
      next: (resp: any) => {
        // guardar factura y navegar
        if (resp && resp.factura) {
          this.facturaService.setFactura(resp.factura);
          this.router.navigate(['/factura']);
        } else {
          this.errorMessage = 'Respuesta inesperada del servidor.';
        }
      },
      error: (error: any) => {
        console.error('Error creando venta:', error);
        if (error.status === 400 || error.status === 404) {
          this.errorMessage = error.error?.message || 'Datos inválidos.';
        } else if (error.status === 401) {
          this.errorMessage = 'No autorizado. Inicia sesión de nuevo.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';
        }
      }
    });
  }
}