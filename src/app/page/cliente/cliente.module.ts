import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PesquisaClienteComponent } from 'src/app/components/pesquisa-cliente/pesquisa-cliente.component';
import { ClientePage } from './cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ClientePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClientePage, PesquisaClienteComponent],
  entryComponents: [PesquisaClienteComponent]
})
export class ClientePageModule { }
