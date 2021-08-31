import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProdutoPageRoutingModule } from './produto-routing.module';
import { ProdutoPage } from './produto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    SharedModule,
    ProdutoPageRoutingModule,
  ],
  declarations: [ProdutoPage],
})
export class ProdutoPageModule {}
