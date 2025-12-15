import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  crearVenta(payload: { Id_Cliente: number; Detalles: { Id_Producto: number; Cantidad: number }[] }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/ventas`, payload, { headers });
  }
}