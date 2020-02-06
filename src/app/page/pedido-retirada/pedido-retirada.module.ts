import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PedidoRetiradaPage } from './pedido-retirada.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoRetiradaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidoRetiradaPage]
})
export class PedidoRetiradaPageModule {}
