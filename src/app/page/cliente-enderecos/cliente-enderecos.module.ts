import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClienteEnderecosPageRoutingModule } from './cliente-enderecos-routing.module';
import { ClienteEnderecosPage } from './cliente-enderecos.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ClienteEnderecosPageRoutingModule],
  declarations: [ClienteEnderecosPage],
})
export class ClienteEnderecosPageModule {}
