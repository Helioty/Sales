import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../../../pipes/pipes.module';

import { PedidoResumoPage } from './pedido-resumo.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoResumoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidoResumoPage]
})
export class PedidoResumoPageModule {}
