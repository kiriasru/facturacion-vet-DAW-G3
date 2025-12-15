import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaService } from '../../services/factura.service';

@Component({
  selector: 'app-factura',
  imports: [CommonModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.scss'
})
export class FacturaComponent implements OnInit {
  factura: any | null = null;

  constructor(private facturaService: FacturaService) {}

  ngOnInit() {
    this.factura = this.facturaService.getFactura();
  }
}
