import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { Produto, ProdutoDepositoRetirada } from 'src/app/class/produto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-produto-adicionar-sacola',
  templateUrl: './produto-adicionar-sacola.page.html',
  styleUrls: ['./produto-adicionar-sacola.page.scss'],
})
export class ProdutoAdicionarSacolaPage implements OnInit {

  public produto = new Produto();
  public depositos: ProdutoDepositoRetirada[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public common: CommonService,
    public pedidoS: PedidoService,
    private produtoS: ProdutoService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.produto = JSON.parse(params.produto);
      console.log('a')
      console.log(this.produto)
    });
  }

  ionViewWillEnter() {
    // this.focusOn();
    this.common.goToFullScreen();
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
    this.produtoS.getDeposito(
      this.produto.codigodigitoembalagem,
      String(this.pedidoS.pedidoHeader.numpedido)
    ).then((result: any) => {
      this.depositos = result;
      console.log('depositos');
      console.log(result);
    });
  }

  ionViewWillLeave() {
    // this.focusOff();
  }

  ionViewDidLeave() { }

}
