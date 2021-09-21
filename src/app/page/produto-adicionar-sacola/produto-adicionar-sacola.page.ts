import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IonInput, IonSlides, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Produto, ProdutoDepositoRetirada } from 'src/app/class/produto';
import { Endereco } from 'src/app/services/cliente/cliente.interface';
import { CommonService } from 'src/app/services/common/common.service';
import { DataService } from 'src/app/services/data/data.service';
import {
  PedidoHeader,
  PedidoItem,
  Retiradas,
} from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { TMSService } from 'src/app/services/TMS/tms.service';

@Component({
  selector: 'app-produto-adicionar-sacola',
  templateUrl: './produto-adicionar-sacola.page.html',
  styleUrls: ['./produto-adicionar-sacola.page.scss'],
})
export class ProdutoAdicionarSacolaPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) readonly slides: IonSlides;
  // Lista de inputs dos depositos
  @ViewChildren('input') input: QueryList<IonInput>;
  // Input do TMS
  @ViewChild('inputTMS', { static: true }) inputTMS: IonInput;
  public inputTMSvalue = 0;

  public pedidoOBS: Observable<PedidoHeader>;

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
  private pedidoItem = new PedidoItem();

  // Retiradas
  private retiradas: Retiradas[] = [];

  // Controle de navegacao
  private navParams: Params;

  // Controla a gravação da opção de TMS para poder prosseguir
  private statusGravacao = false;

  constructor(
    private readonly route: ActivatedRoute,
    private navControl: NavController,
    private dataService: DataService,
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly produtoService: ProdutoService,
    private readonly tmsService: TMSService
  ) {}

  ngOnInit(): void {
    this.slides.lockSwipes(true);
    this.pedidoOBS = this.pedidoService.getPedidoAtivo();
    this.produto = this.dataService.getData('produto-adicionar-sacola');
    this.route.queryParams.subscribe({
      next: (params) => (this.navParams = params),
    });
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
    this.pedidoItem = new PedidoItem();
    this.pedidoItem.idEmpresa = parseInt(localStorage.getItem('empresa'));
    this.pedidoItem.numPedido = this.pedidoService.getPedidoNumero();
    this.pedidoItem.idProduto = this.produto.codigodigitoembalagem;
    this.pedidoItem.embalagem = 0;
    this.pedidoItem.qtdTotal = 0;
    this.pedidoItem.prcUnitario = 0;
    this.pedidoItem.prcTotal = 0;
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
    this.produtoService
      .getDeposito(
        this.produto.codigodigitoembalagem,
        String(this.pedidoService.getPedidoNumero())
      )
      .subscribe({
        next: (result: any) => {
          this.depositos = result;
          this.showDepositos = true;
          console.log('depositos');
          console.log(result);
        },
        error: () => {
          this.showDepositos = true;
        },
      });
  }

  ionViewWillLeave(): void {}

  ionViewDidLeave(): void {}

  goToSlide(slide: number): void {
    this.slides.lockSwipes(false);
    this.slides.slideTo(slide);
    this.slides.lockSwipes(true);
    this.atualizaBySlide();
  }

  atualizaBySlide(): void {
    this.slides.getActiveIndex().then((result) => {
      switch (result) {
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
    if (this.entregaTMSselecionada && this.inputTMSvalue) {
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

  zeroQtd(): void {
    this.common.showAlert('Atenção!', 'Informar quantidade retirada.');
  }

  async adicionar() {
    // Chama a gravação do TMS
    if (this.entregaTMSselecionada && this.inputTMSvalue) {
      await this.adicionarComTMS(this.inputTMSvalue, this.produto);
    }
    //  Chama a gracação da retirada em Loja
    if (this.validaQtdRetiradaLoja()) {
      await this.adicionarLocal(this.depositos);
    } else {
      if (this.statusGravacao) {
        this.prosseguir();
      }
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
        return;
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
    // this.pedidoItens.retiradas = this.retiradas;
    // await this.pedidoIt.addItemPedido(this.pedidoItens).then((result) => {
    //   console.log('Resultado');
    //   console.log(result);
    //   this.prosseguir();
    // });
  }

  async adicionarComTMS(qtd: number, prod: any) {
    await this.tmsService
      .gravaOpcoesTMS(
        String(this.pedidoService.getPedidoNumero()),
        String(qtd),
        this.produto.codigodigitoembalagem,
        prod.conversao
      )
      .then(
        () => {
          this.statusGravacao = true;
        },
        (error) => {
          this.statusGravacao = false;
          console.log(error);
        }
      );
  }

  private searchEnderecoOnList(seq: number, enderecos: Endereco[]): Endereco {
    return enderecos.find((ende) => ende.id.sequencialId === seq);
  }

  getOpcoes(qtd: number): void {
    let precolocal: 'S' | 'N';
    if (this.validaQtdRetiradaLoja()) {
      precolocal = 'S';
    } else {
      precolocal = 'N';
    }

    // await this.pedidoService.retornaDadosCliente().then(
    //   () => {
    //     enderecos = this.pedidoS.dadosCliente.enderecos;
    //   },
    //   () => {
    //     return this.getOpcoes(qtd);
    //   }
    // );
    const enderecos = this.pedidoService.getClienteEnderecos();
    const sequen = this.pedidoService.getPedidoEnderecoEntrega();
    const endereco = this.searchEnderecoOnList(sequen, enderecos);

    this.loadingTMS = true;
    this.tmsService
      .getOpcoesTMS(endereco, String(qtd), this.produto.codigodigitoembalagem, precolocal)
      .subscribe({
        next: (result) => {
          this.dadosRetornoTMS = result;
          this.loadingTMS = false;
          console.log('opcoes entrega');
          console.log(result);

          // by Helio 09/01/2020
          // Seleciona automaticamente caso exista apenas uma opção de entrega
          if (result.length === 1) {
            this.vendedorSelecionado = this.dadosRetornoTMS[0];
            if (this.vendedorSelecionado.opcoes.length === 1) {
              this.opcaoSelecionada = this.vendedorSelecionado.opcoes[0];
              this.entregaTMSselecionada = true;
            }
          }
        },
        error: () => {
          this.loadingTMS = false;
        },
      });
  }
}
