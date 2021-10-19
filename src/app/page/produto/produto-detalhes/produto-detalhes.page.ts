import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { DataService } from 'src/app/services/data/data.service';
import { IProduto } from 'src/app/services/produto/produto.interface';

@Component({
  selector: 'app-produto-detalhes',
  templateUrl: './produto-detalhes.page.html',
  styleUrls: ['./produto-detalhes.page.scss'],
})
export class ProdutoDetalhesPage implements OnInit {
  public produto: IProduto;
  public info: any = [];

  readonly dataId = 'produtoInformacao';

  constructor(
    private readonly common: CommonService,
    private readonly dataService: DataService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('ProdutoDetalhes OnInit');
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.produto = JSON.parse(params.produto);
      this.info = this.dataService.getData(this.dataId);
    });
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewWillLeave(): void {
    this.dataService.removeData(this.dataId);
  }
}
