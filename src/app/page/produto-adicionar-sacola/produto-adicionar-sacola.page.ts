import { Component, OnInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { Produto, ProdutoDepositoRetirada } from 'src/app/class/produto';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-produto-adicionar-sacola',
  templateUrl: './produto-adicionar-sacola.page.html',
  styleUrls: ['./produto-adicionar-sacola.page.scss'],
})
export class ProdutoAdicionarSacolaPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  @ViewChildren("input") input: QueryList<any>;

  public produto = new Produto();
  public depositos: ProdutoDepositoRetirada[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public common: CommonService,
    public pedidoS: PedidoService,
    private produtoS: ProdutoService,
  ) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
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

  goToSlide(slide: number) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
  }










  // edit by Helio 03/06/2020
  validateField(): boolean {
    for (var i in this.depositos) {
      if (this.depositos[i].qtdPedido > 0) {
        return true;
      }
    };
  }

  addItemSacola(itemSacola) {

    let aRetiradas: any[] = [];

    for (var i in itemSacola) {
      if (itemSacola[i].estoque < itemSacola[i].qtdPedido) {
        // console.log("itemSacola");
        // console.log(document.getElementById(id));
        // this.SetFocusOn2(i);
        // this.alertEstoque(i, itemSacola[i].estoque, itemSacola[i].deposito);
        break;
      } else {
        if (parseInt(itemSacola[i].qtdPedido) > 0) {
          // this.retiradas = new Retiradas();
          // this.retiradas.empresaRetirada = parseInt(itemSacola[i].empresa);
          // this.retiradas.idDeposito = parseInt(itemSacola[i].deposito);
          // this.retiradas.tipoRetirada = parseInt(itemSacola[i].tipoEntrega);

          // this.retiradas.qtd = parseFloat(itemSacola[i].qtdPedido);
          // this.retiradas.precoUnitario = this.item.prvd1;

          //add array
          // aRetiradas.push(this.retiradas);
        }

        // this.isenabled = parseInt(itemSacola[i].qtdPedido) > 0;

      }
    }

    try {
      // if (this.exibeFinalizacao) {
      // this.pedidoItens.retiradas = aRetiradas;

      // if (this.pedidoItens.numPedido == 0 || this.pedidoItens.numPedido == null) {
      // this.commonServices.showToast('ATENÇÃO! ' + this.pedidoItens.numPedido);
      // }

      console.log('SACOLA');
      // console.log(this.pedidoItens);

      // this.addItemPedido(this.pedidoItens);

      // this.qtdeItemPedido = this.retiradas.qtd;
      // this.commonServices.sistuacaoPedido = "A"; // altera situação do pedido

      // let qtd: number = this.commonServices.qtdBasketItens;
      // this.navCtrl.push("ProdutoLista", { basket: this.existQtdBasket, mode: 1 });
      // }
    } catch (error) {
      console.log(error);
      // this.commonServices.showToast(error);
    }
  }

}
