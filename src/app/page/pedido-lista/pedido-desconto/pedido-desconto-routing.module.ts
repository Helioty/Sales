import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoDescontoPage } from './pedido-desconto.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoDescontoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoDescontoPageRoutingModule {}
