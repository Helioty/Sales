import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PedidoRapidoPage } from './pedido-rapido.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoRapidoPage,
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
  declarations: [PedidoRapidoPage],
})
export class PedidoRapidoPageModule {}
