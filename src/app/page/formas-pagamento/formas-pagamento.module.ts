import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormasPagamentoPage } from './formas-pagamento.page';

const routes: Routes = [
  {
    path: '',
    component: FormasPagamentoPage,
    children: [
      {
        path: 'parcelamento',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./parcelamento/parcelamento.module')
                .then(m => m.ParcelamentoPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FormasPagamentoPage]
})
export class FormasPagamentoPageModule {}
