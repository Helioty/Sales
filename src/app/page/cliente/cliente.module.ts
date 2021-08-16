import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PesquisaClienteComponent } from 'src/app/components/pesquisa-cliente/pesquisa-cliente.component';
import { ClientePageRoutingModule } from './cliente-routing.module';
import { ClientePage } from './cliente.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ClientePageRoutingModule],
  declarations: [ClientePage, PesquisaClienteComponent],
})
export class ClientePageModule {}
