import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FormasPagamentoPage } from './formas-pagamento.page';

const routes: Routes = [
  {
    path: '',
    component: FormasPagamentoPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [FormasPagamentoPage],
})
export class FormasPagamentoPageModule {}
