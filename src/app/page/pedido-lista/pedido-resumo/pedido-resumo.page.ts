import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-pedido-resumo',
  templateUrl: './pedido-resumo.page.html',
  styleUrls: ['./pedido-resumo.page.scss'],
})
export class PedidoResumoPage implements OnInit {
  public pedido: any;
  public showPedido = false;

  public pedidoItens: any;
  public showPedidoItens = false;

  public cartaoPedido: any;
  public docCliente = '';
  public docTipo = '';
  public endereco: any;

  constructor(
    public common: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.common.goToFullScreen();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.pedido = JSON.parse(params.pedido);
    });
    await this.separaDadosPedido();
    console.log(this.pedido);
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  async separaDadosPedido() {
    this.cartaoPedido = this.pedido.barCodecartaoPedido;
    if (this.pedido.cartaoPedido === 0) {
      this.cartaoPedido = 'Sem Cartão';
    }
    if (this.pedido.cgccpf_cliente == null) {
      this.docCliente = '';
      this.docTipo = 'Cliente não selecionado.';
    } else {
      this.docCliente = this.pedido.cgccpf_cliente;
      if (!this.docCliente) {
        this.docCliente = 'Sem Cliente';
      }
      this.docTipo = this.docCliente.length > 12 ? 'CNPJ do cliente:' : 'CPF do cliente:';
    }
    this.showPedido = true;

    this.getItensMaisEndereco(this.pedido.numpedido);
  }

  // Modificado por Nicollas Bastos em 10-09-2018
  // Modificado por Helio em 21/01/2020
  // Metodo carrega todas as informações necessárias da lista de produtos e endereço de entrega
  async getItensMaisEndereco(nuPedido: any) {
    try {
      // if (this.pedido.totpedido > 0) {
      //   this.exibeProdutos = true;
      // } else {
      //   this.exibeProdutos = false;
      //   this.ngZone.run(() => {
      //     this.skeletonLoading = false;
      //   });
      //   return;
      // }
      // cabeçalho do pedido
      // item do pedido
      // const link =
      //   ENV.WS_VENDAS +
      //   API_URL +
      //   'PedidoVendaItem/' +
      //   localStorage.getItem('empresa') +
      //   '/' +
      //   nuPedido +
      //   '/itens';
      // await this.baseService.get(link).then((result: any) => {
      //   console.log(result);
      //   this.pedidoItens = result.content;
      // });
      // if (this.pedido.frete.valor > 0) {
      //   let enderecos: any;
      //   const linkEndereco =
      //     ENV.WS_VENDAS +
      //     API_URL +
      //     'PedidoVenda/' +
      //     localStorage.getItem('empresa') +
      //     '/' +
      //     nuPedido +
      //     '/listEnderecos';
      //   await this.baseService.get(linkEndereco).then((result: any) => {
      //     console.log(result);
      //     enderecos = result;
      //   });
      //   if (enderecos.length > 0) {
      //     for (const end of enderecos) {
      //       if (end.seq_endereco === this.pedido.seqEnderecoEntrega) {
      //         this.endereco = end.dsc_endereco;
      //       }
      //     }
      //   }
      // }
      // if (this.show.length != this.produtos.totalElements) {
      //   this.show = new Array<boolean>(this.produtos.totalElements);
      // }
    } catch (error) {
      // this.exibeProdutosPedido = false;
      // this.exibeProdutos = true;
      // this.commonServices.showToast(error.json().detail);
    }
    // this.ngZone.run(() => {
    //   this.skeletonLoading = false;
    // });
  }
}
