import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PedidoRetiradaPage } from './pedido-retirada.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoRetiradaPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [PedidoRetiradaPage],
})
export class PedidoRetiradaPageModule {}
