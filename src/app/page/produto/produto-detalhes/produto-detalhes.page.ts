import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { DataService } from 'src/app/services/data/data.service';
import { Produto } from 'src/app/class/produto';

@Component({
  selector: 'app-produto-detalhes',
  templateUrl: './produto-detalhes.page.html',
  styleUrls: ['./produto-detalhes.page.scss'],
})
export class ProdutoDetalhesPage implements OnInit {

  public produto = new Produto();
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
      console.log(params)
      this.produto = JSON.parse(params.produto);
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
