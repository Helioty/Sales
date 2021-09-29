import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { PedidoAtalhosPage } from './pedido-atalhos.page';
import { SwiperModule } from 'swiper/angular';

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
    SwiperModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PedidoAtalhosPage],
})
export class PedidoAtalhosPageModule {}
