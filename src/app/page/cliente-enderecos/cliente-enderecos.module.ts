import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ClienteEnderecosPageRoutingModule } from './cliente-enderecos-routing.module';
import { ClienteEnderecosPage } from './cliente-enderecos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ClienteEnderecosPageRoutingModule,
  ],
  declarations: [ClienteEnderecosPage],
})
export class ClienteEnderecosPageModule {}
