import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { PedidoAbertoPage } from './pedido-aberto.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoAbertoPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PedidoAbertoPage],
})
export class PedidoAbertoPageModule {}
