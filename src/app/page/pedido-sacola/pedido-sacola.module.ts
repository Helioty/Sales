import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PedidoSacolaPage } from './pedido-sacola.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoSacolaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidoSacolaPage]
})
export class PedidoSacolaPageModule {}
