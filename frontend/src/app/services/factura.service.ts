import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private storageKey = 'factura';

  setFactura(factura: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(factura));
  }

  getFactura(): any | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : null;
  }

  clearFactura() {
    localStorage.removeItem(this.storageKey);
  }
}
