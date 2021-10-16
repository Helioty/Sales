import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PedidoDescontoPageRoutingModule } from './pedido-desconto-routing.module';
import { PedidoDescontoPage } from './pedido-desconto.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PedidoDescontoPageRoutingModule],
  declarations: [PedidoDescontoPage],
})
export class PedidoDescontoPageModule {}
