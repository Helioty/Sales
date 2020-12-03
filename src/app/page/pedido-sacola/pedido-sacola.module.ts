import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
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
    PipesModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PedidoSacolaPage]
})
export class PedidoSacolaPageModule { }
