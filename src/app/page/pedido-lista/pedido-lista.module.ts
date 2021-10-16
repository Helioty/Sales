import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PedidoListaPage } from './pedido-lista.page';
import { PedidoListaService } from './pedido-lista.service';

const routes: Routes = [
  {
    path: '',
    component: PedidoListaPage,
    children: [
      {
        path: 'pedido-aberto',
        loadChildren: () =>
          import('./pedido-aberto/pedido-aberto.module').then(
            (m) => m.PedidoAbertoPageModule
          ),
      },
      {
        path: 'pedido-finalizado',
        loadChildren: () =>
          import('./pedido-finalizado/pedido-finalizado.module').then(
            (m) => m.PedidoFinalizadoPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/pedido-lista/pedido-aberto',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'pedido-resumo',
    loadChildren: () =>
      import('./pedido-resumo/pedido-resumo.module').then(
        (m) => m.PedidoResumoPageModule
      ),
  },
  {
    path: 'pedido-desconto',
    loadChildren: () =>
      import('./pedido-desconto/pedido-desconto.module').then(
        (m) => m.PedidoDescontoPageModule
      ),
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [PedidoListaPage],
  providers: [PedidoListaService],
})
export class PedidoListaPageModule {}
