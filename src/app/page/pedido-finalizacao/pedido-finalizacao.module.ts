import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PedidoFinalizacaoPage } from './pedido-finalizacao.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoFinalizacaoPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PedidoFinalizacaoPage],
})
export class PedidoFinalizacaoPageModule {}
