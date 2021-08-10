import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListaEnderecoGuard implements CanActivate {
  constructor(private common: CommonService, private pedidoService: PedidoService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // if (
    //   this.pedidoService.clientSelected &&
    //   this.pedidoService.docCliente !== '' &&
    //   this.pedidoService.dadosCliente !== undefined
    // ) {
    //   return true;
    // } else if (
    //   this.pedidoService.clientSelected &&
    //   this.pedidoService.docCliente !== '' &&
    //   this.pedidoService.dadosCliente === undefined
    // ) {
    //   this.common.showLoader();
    //   this.pedidoService.retornaDadosCliente().then(
    //     () => {
    //       this.common.loading.dismiss();
    //       return true;
    //     },
    //     () => {
    //       this.common.loading.dismiss();
    //       return false;
    //     }
    //   );
    // } else {
    //   this.common.showAlert('Atenção!', 'Selecione um cliente antes de continuar');
    //   return false;
    // }
    return false;
  }
}
