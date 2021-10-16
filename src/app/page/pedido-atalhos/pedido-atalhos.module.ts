import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PedidoAtalhosPage } from './pedido-atalhos.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoAtalhosPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PedidoAtalhosPage],
})
export class PedidoAtalhosPageModule {}
