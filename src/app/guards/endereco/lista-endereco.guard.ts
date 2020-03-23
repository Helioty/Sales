import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaEnderecoGuard implements CanActivate {

  constructor(private pedidoService: PedidoService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.pedidoService.clientSelected && this.pedidoService.docCliente !== '' && this.pedidoService.dadosCliente !== undefined) {
      return true;
    } else {
      return false;
    }
  }

}
