import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInput, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { CondicaoPagamentoService } from 'src/app/services/pagamento/condicao-pagamento.service';
import { OpcaoParcela, PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-parcelamento',
  templateUrl: './parcelamento.page.html',
  styleUrls: ['./parcelamento.page.scss'],
})
export class ParcelamentoPage implements OnInit, OnDestroy {
  @ViewChild(IonInput) readonly input: IonInput;

  // Dados do Pedido.
  private pedidoSub: Subscription;
  public pedido: PedidoHeader;

  public opcoesList: any[] = [];

  public opcaoSelect: OpcaoParcela;

  public labelEntrada = 'Sem entrada';
  public hasEntrada = false;
  public entradaValue = 0;

  public buttonDisable = true;

  constructor(
    private readonly common: CommonService,
    private readonly pedidoService: PedidoService,
    private readonly pagamento: CondicaoPagamentoService,
    private navControl: NavController
  ) {}

  ngOnInit(): void {
    const pedidoOBS = this.pedidoService.getPedidoAtivo();
    this.pedidoSub = pedidoOBS.subscribe({ next: (pedido) => (this.pedido = pedido) });
    this.opcaoSelect = new OpcaoParcela();
    this.common.showLoader();
  }

  ionViewWillEnter(): void {
    this.common.goToFullScreen();
  }

  ionViewDidEnter(): void {
    this.common.goToFullScreen();
    this.getCondicoes();
  }

  ngOnDestroy(): void {
    this.pedidoSub.unsubscribe();
  }

  getCondicoes(): void {
    this.pagamento
      .getCondicaoPagamento(this.pedido.tipodoc, this.pedido.numpedido)
      .subscribe({
        next: (result) => {
          console.log(result);
          this.opcoesList = result;
          this.common.loading.dismiss();
        },
        error: (error) => {
          console.log(error);
          this.common.loading.dismiss();
        },
      });
  }

  changeEntrada() {
    this.hasEntrada = !this.hasEntrada;

    if (this.hasEntrada) {
      this.labelEntrada = 'Com entrada';
    } else {
      this.labelEntrada = 'Sem entrada';
      this.entradaValue = 0;
    }
  }

  keyupEvent() {
    // this.input.value = this.common.currency(this.input.value);
  }

  verificaEntrada(evento: any) {
    if (this.entradaValue > 0) {
      this.getCondicaoPagamentoComEntrada(this.entradaValue);
      evento.target.blur();
    }
  }

  async getCondicaoPagamentoComEntrada(valor: number): Promise<void> {
    if (valor > this.pedido.totpedido) {
      this.common.showAlertAction({
        titulo: 'Valor inválido',
        message: 'O valor da entrada não pode ser maior que o valor do pedido!',
        handler: () => {
          this.input.setFocus();
        },
      });
    } else {
      await this.common.showLoader();
      this.pagamento
        .getCondicaoPagamento(this.pedido.tipodoc, this.pedido.numpedido, valor)
        .subscribe({
          next: (result) => {
            console.log(result);
            this.opcoesList = result;
            this.common.loading.dismiss();
            this.opcaoSelect = new OpcaoParcela();
          },
          error: (error) => {
            console.log(error);
            this.common.loading.dismiss();
          },
        });
    }
  }

  // by Ryuge 18/12/2018
  // edit by Helio 30/03/2020
  async continuar(): Promise<void> {
    await this.common.showLoader();
    this.pedidoService
      .setCondicaoPagamento(this.opcaoSelect, this.input.value)
      .subscribe({
        next: (result) => {
          this.navControl.navigateRoot(['pedido-finalizacao']);
          this.common.loading.dismiss();
        },
        error: (error) => {
          console.log(error);
          this.common.loading.dismiss();
        },
      });
  }
}
