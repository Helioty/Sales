import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PedidoListaPage } from './pedido-lista.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoListaPage,
    children: [
      {
        path: 'pedido-aberto',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pedido-aberto/pedido-aberto.module').then(m => m.PedidoAbertoPageModule)
          }
        ]
      },
      {
        path: 'pedido-finalizado',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pedido-finalizado/pedido-finalizado.module').then(m => m.PedidoFinalizadoPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/pedido-lista/pedido-aberto',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [PedidoListaPage]
})
export class PedidoListaPageModule {}
