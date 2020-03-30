import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HideKeyboardModule } from 'hide-keyboard';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { IonicModule } from '@ionic/angular';

import { PedidoFinalizacaoPage } from './pedido-finalizacao.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoFinalizacaoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    HideKeyboardModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidoFinalizacaoPage]
})
export class PedidoFinalizacaoPageModule {}
