import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientePageRoutingModule } from './cliente-routing.module';
import { ClientePage } from './cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ClientePageRoutingModule,
  ],
  declarations: [ClientePage],
})
export class ClientePageModule {}
