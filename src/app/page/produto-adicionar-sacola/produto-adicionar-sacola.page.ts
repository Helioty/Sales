import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { PedidoItemService } from 'src/app/services/pedido/pedido-item.service';
import { TMSService } from 'src/app/services/TMS/tms.service';
import { Produto, ProdutoDepositoRetirada } from 'src/app/class/produto';
import { ActivatedRoute } from '@angular/router';
import { IonSlides, IonInput, NavController } from '@ionic/angular';
import { Retiradas, PedidoItens } from 'src/app/class/pedido';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-produto-adicionar-sacola',
  templateUrl: './produto-adicionar-sacola.page.html',
  styleUrls: ['./produto-adicionar-sacola.page.scss'],
})
export class ProdutoAdicionarSacolaPage implements OnInit {

  // Slide da pagina
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  // Lista de inputs dos depositos
  @ViewChildren('input') input: QueryList<IonInput>;

  // Input do TMS
  @ViewChild('inputTMS', { static: true }) inputTMS: IonInput;
  public inputTMSvalue = 0;

  // Produto e depositos de retirada
  public produto = new Produto();
  public depositos: ProdutoDepositoRetirada[] = [];
  public showDepositos = false;

  // Dados do TMS
  public dadosRetornoTMS: any[] = [];
  public vendedorSelecionado: any;
  public opcaoSelecionada: any;
  public loadingTMS = false;

  // Controle de adicionar a sacola
  private entregaTMSselecionada = false;

  // Controle dos itens do pedido
  private pedidoItens: PedidoItens;

  // Retiradas
  private retiradas: Retiradas[] = [];

  // Controle de navegacao
  private navParams: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navControl: NavController,
    private dataService: DataService,
    public common: CommonService,
    public pedidoS: PedidoService,
    private pedidoIt: PedidoItemService,
    private produtoS: ProdutoService,
    private tms: TMSService
  ) { }

  ngOnInit() {
    this.slides.lockSwipes(true);
    this.produto = this.dataService.getData('produto-adicionar-sacola');
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.navParams = params;
    });
  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    this.pedidoItens = new PedidoItens(localStorage.getItem('empresa'), this.pedidoS.pedidoHeader.numpedido);
    this.pedidoItens.idEmpresa = parseInt(localStorage.getItem('empresa'));
    this.pedidoItens.numPedido = this.pedidoS.pedidoHeader.numpedido;
    this.pedidoItens.idProduto = this.produto.codigodigitoembalagem;
    this.pedidoItens.embalagem = 0;
    this.pedidoItens.qtdTotal = 0;
    this.pedidoItens.prcUnitario = 0;
    this.pedidoItens.prcTotal = 0;
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
    this.produtoS.getDeposito(
      this.produto.codigodigitoembalagem,
      String(this.pedidoS.pedidoHeader.numpedido)
    ).then((result: any) => {
      this.depositos = result;
      this.showDepositos = true;
      console.log('depositos');
      console.log(result);
    }, () => {
      this.showDepositos = true;
    });
  }

  ionViewWillLeave() { }

  ionViewDidLeave() { }

  goToSlide(slide: number) {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
    this.atualizaBySlide();
  }

  atualizaBySlide() {
    this.slides.getActiveIndex().then((result: number) => {
      switch (result) {
        case 0:

          break;

        case 1:
          setTimeout(() => {
            this.inputTMS.setFocus();
          }, 200);
          break;

        default:
          break;
      }
    });
  }








  // edit by Helio 09/07/2020
  validateField(): boolean {
    if (this.entregaTMSselecionada && this.inputTMSvalue > 0) {
      return true;
    } else {
      return this.validaQtdRetiradaLoja();
    }
  }

  validaQtdRetiradaLoja(): boolean {
    for (const el in this.depositos) {
      if (this.depositos[el].qtdPedido > 0) {
        return true;
      }
    }
  }

  zeroQtd() {
    this.common.showAlert('Atenção!', 'Informar quantidade retirada.');
  }

  async adicionar() {
    // Chama a gravação do TMS
    if (this.entregaTMSselecionada && this.inputTMSvalue > 0) {
      await this.adicionarComTMS();
    }
    //  Chama a gracação da retirada em Loja
    if (this.validaQtdRetiradaLoja()) {
      await this.adicionarLocal(this.depositos);
    } else {
      this.prosseguir();
    }
  }

  prosseguir() {
    if (this.navParams.paginaAnterior) {
      switch (this.navParams.paginaAnterior) {
        case 'pedido-sacola':
          this.navControl.pop();
          break;

        default:
          this.navControl.navigateRoot('pedido-sacola');
          break;
      }
    } else {
      this.navControl.navigateRoot('pedido-sacola');
    }
  }

  async adicionarLocal(depositos: ProdutoDepositoRetirada[]) {
    for (const el in depositos) {
      if (depositos[el].qtdPedido > depositos[el].estoque) {
        this.common.showToast('Estoque insuficiente');
        this.input.toArray()[el].setFocus();
        return
      } else if (depositos[el].qtdPedido > 0) {
        const retirada = new Retiradas();
        retirada.empresaRetirada = parseInt(depositos[el].empresa);
        retirada.idDeposito = parseInt(depositos[el].deposito);
        retirada.tipoRetirada = parseInt(depositos[el].tipoEntrega);
        retirada.qtd = depositos[el].qtdPedido;
        retirada.precoUnitario = this.produto.prvd1;

        this.retiradas.push(retirada);
      }
    }
    this.pedidoItens.retiradas = this.retiradas;
    await this.pedidoIt.addItemPedido(this.pedidoItens).then((result) => {
      console.log('Resultado');
      console.log(result);
      this.prosseguir();
    });
  }

  async adicionarComTMS() {

  }


  async ende(seq: any, enderecos: any[]) {
    for (const el in enderecos) {
      if (enderecos[el].id.sequencialId === seq) {
        return enderecos[el];
      }
    }
  }

  async getOpcoes(qtd: number) {
    let precolocal: string;
    if (this.validaQtdRetiradaLoja()) {
      precolocal = 'S';
    } else {
      precolocal = 'N';
    }

    const enderecos = this.pedidoS.dadosCliente.enderecos;
    const sequen = this.pedidoS.pedidoHeader.seqEnderecoEntrega;
    const ende = await this.ende(sequen, enderecos);

    this.loadingTMS = true;
    this.tms.getOpcoesTMS(
      ende, String(qtd), this.produto.codigodigitoembalagem, precolocal
    ).then((result: any) => {
      this.dadosRetornoTMS = result;
      this.loadingTMS = false;
      console.log('opcoes entrega');
      console.log(result);

      // by Helio 09/01/2020
      // Seleciona automaticamente caso exista apenas uma opção de entrega
      if (result.length === 1) {
        this.vendedorSelecionado = this.dadosRetornoTMS[0];
        if (this.vendedorSelecionado.opcoes.length == 1) {
          this.opcaoSelecionada = this.vendedorSelecionado.opcoes[0];
        }
      }
    }, (error) => {
      this.loadingTMS = false;
      console.log(error);
    });
  }

}
