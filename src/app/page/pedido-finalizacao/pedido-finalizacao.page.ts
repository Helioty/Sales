import { Component, OnInit } from '@angular/core';
import { PedidoItemService } from 'src/app/services/pedido/pedido-item.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NavController, Platform } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pedido-finalizacao',
  templateUrl: './pedido-finalizacao.page.html',
  styleUrls: ['./pedido-finalizacao.page.scss'],
})
export class PedidoFinalizacaoPage implements OnInit {

  public taskScanner: any;
  public valorScanner: string;
  public focusStatus = true;

  // Exibição
  public numeroPedido: string;
  public totalProdutos: any;
  public existeFrete = false;
  public frete: any;
  public icmsRetido: any;
  public descontoBrinde: any;
  public desconto: any;
  public existeParcela = false;
  public qtdParcelas: any;
  public parcela: any;
  public entrada = 0;
  public pesoPedido: any;
  public totalPedido: any;


  // Produtos
  public itens: any[] = [];


  constructor(
    public common: CommonService,
    public pedido: PedidoService,
    public pedidoIt: PedidoItemService,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  ngOnInit() { }

  adicionarCartaoPedido() { }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.focusOn();
    this.common.goToFullScreen();
    this.numeroPedido =
      this.pedido.pedidoHeader.numpedido + '-' +
      this.pedido.pedidoHeader.digito.toString();

    // by Ryuge 12/12/2018
    this.totalProdutos =
      this.pedido.pedidoHeader.totpedido - this.pedido.pedidoHeader.frete.valor +
      this.pedido.pedidoHeader.descontoBrinde + this.pedido.pedidoHeader.valorDesconto;

    this.pesoPedido = this.pedido.pedidoHeader.pesoTotal;
    this.totalPedido = this.pedido.pedidoHeader.valorTotalPedido;

    if (this.pedido.pedidoHeader.tipoEntrega === 'ENTREGA') {
      this.frete = this.pedido.pedidoHeader.frete.valor;
      this.existeFrete = true;
    }

    if (this.pedido.pedidoHeader.qtdParcelas > 0) {
      this.qtdParcelas = this.pedido.pedidoHeader.qtdParcelas;
      this.parcela = this.pedido.pedidoHeader.valorParcela;
      this.entrada = this.pedido.pedidoHeader.valorEntrada;
      this.existeParcela = true;
    } else {
      this.qtdParcelas = 0;
      this.parcela = 0;
      this.existeParcela = false;
    }

    // by Ryuge 11/12/2018
    if (this.pedido.pedidoHeader.descontoBrinde > 0) {
      this.descontoBrinde = this.pedido.pedidoHeader.descontoBrinde;
    } else {
      this.descontoBrinde = 0;
    }

    // by Ryuge 11/12/2018
    if (this.pedido.pedidoHeader.valorDesconto > 0) {
      this.desconto = this.pedido.pedidoHeader.valorDesconto;
    } else {
      this.desconto = 0;
    }

    if (this.pedido.pedidoHeader.icmsRetido > 0) {
      this.icmsRetido = this.pedido.pedidoHeader.icmsRetido;
    } else {
      this.icmsRetido = 0;
    }

    this.getItemPedido();
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {
    this.focusOff();
  }

  ionViewDidLeave() {
    console.clear();
  }

  // Cria o loop que da foco no input
  focusOn() {
    if (this.platform.is('cordova')) {
      this.taskScanner = setInterval(() => {
        try {
          this.valorScanner = '';
          if (this.focusStatus) {
            document.getElementById('scanner').focus();
          }
        } catch (error) { }
      }, 300);
    }
  }

  focusPlay() {
    this.focusStatus = true;
  }

  focusPause() {
    this.focusStatus = false;
    document.getElementById('scanner').blur();
  }

  // Encerra o loop de foco no input
  focusOff() {
    setTimeout(() => {
      clearInterval(this.taskScanner);
    }, 150);
  }

  scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusPause();
        const codigo: string = evento.target.value;

        if (codigo.substring(0, 1) === 'P') {
          this.pedido.setCardPedido(codigo);
          this.focusPlay();
        } else {
          this.focusPlay();
        }
      }
    } catch (error) {
      this.focusPlay();
    }
  }

  async getItemPedido() {
    await this.pedidoIt.getItemPedido().then((result: any) => {
      this.itens = result.content;
      console.log(result);
    });
  }

  openClientePage() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'pedido-finalizacao'
      }
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
  }

  openFormasPagamentoPage() {
    this.navControl.navigateForward(['/formas-pagamento']);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'pedido-finalizacao'
      }
    };
    this.navControl.navigateForward(['/formas-pagamento'], navigationExtras);
  }

}
