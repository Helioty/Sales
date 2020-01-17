import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PedidoAbertoPage } from './pedido-aberto.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoAbertoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidoAbertoPage]
})
export class PedidoAbertoPageModule {}
