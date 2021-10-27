import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { AdicionarEnderecoComponent } from './adicionar-endereco/adicionar-endereco.component';
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
  declarations: [ClienteEnderecosPage, AdicionarEnderecoComponent],
})
export class ClienteEnderecosPageModule {}
