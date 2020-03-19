import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-produto-detalhes',
  templateUrl: './produto-detalhes.page.html',
  styleUrls: ['./produto-detalhes.page.scss'],
})
export class ProdutoDetalhesPage implements OnInit {

  public produto: any;
  public info = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    public common: CommonService,
    public produtoService: ProdutoService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.produto = this.dataService.getData(params.produto);
      this.info = this.dataService.getData(params.info);
    });
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {
    console.clear();
  }

  ionViewDidLeave() {

  }

}
