import { Component, OnInit, ViewChild } from '@angular/core';
import { CondicaoPagamentoService } from 'src/app/services/pagamento/condicao-pagamento.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';
import { NavController, AlertController, IonInput } from '@ionic/angular';
import { OpcaoParcela } from 'src/app/class/pedido';

@Component({
  selector: 'app-parcelamento',
  templateUrl: './parcelamento.page.html',
  styleUrls: ['./parcelamento.page.scss'],
})
export class ParcelamentoPage implements OnInit {
  @ViewChild(IonInput, { static: false }) input: IonInput;

  public opcoesList: any[] = [];

  public opcaoSelect: OpcaoParcela;

  public labelEntrada = 'Sem entrada';
  public hasEntrada = false;
  public entradaValue = 0;

  public buttonDisable = true;

  constructor(
    public common: CommonService,
    public pedido: PedidoService,
    private pagamento: CondicaoPagamentoService,
    private alertCtrl: AlertController,
    private navControl: NavController
  ) {
    this.opcaoSelect = new OpcaoParcela();
  }

  async ngOnInit() {
    await this.common.showLoader();
  }

  ionViewWillEnter() {
    this.common.goToFullScreen();
    this.pagamento.getCondicaoPagamento(this.pedido.pedidoHeader.tipodoc, this.pedido.numPedido)
      .then((result: any) => {
        console.log(result);
        this.opcoesList = result;
        this.common.loading.dismiss();
      }, (error) => {
        console.log(error);
        this.common.loading.dismiss();
      });
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {

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
    this.input.value = this.common.currency(this.input.value);
  }

  async showAlert(titulo: string, msg: string) {
    if (msg != null) {
      const alert = await this.alertCtrl.create({
        header: titulo,
        message: msg,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.input.setFocus();
          }
        }]
      });
      await alert.present();
    }
  }

  verificaEntrada() {
    const input = this.input.getInputElement();
    console.log(input);
  }

  async getCondicaoPagamentoComEntrada(evento: any) {
    // tslint:disable-next-line: radix
    const intValue = parseInt(evento.target.value);
    if (intValue > this.pedido.pedidoHeader.totpedido) {
      this.showAlert(
        'Valor inválido', 'O valor da entrada não pode ser maior que o valor do pedido!'
      );
      return;
    }
    await this.common.showLoader();
    this.pagamento.getCondicaoPagamentoComEntrada(
      this.pedido.pedidoHeader.tipodoc, this.pedido.numPedido, evento.target.value
    ).then((result: any) => {
      console.log(result);
      this.opcoesList = result;
      this.common.loading.dismiss();
      this.opcaoSelect = new OpcaoParcela();
    }, (error) => {
      console.log(error);
      this.common.loading.dismiss();
    });
  }

  // by Ryuge 18/12/2018
  // edit by Helio 30/03/2020
  async continuar() {
    await this.common.showLoader();
    this.pagamento.setCondicaoPagamento(
      this.opcaoSelect, this.input.value
    ).then((result: any) => {
      this.pedido.atualizaPedidoHeader(result);
      this.navControl.navigateRoot(['pedido-finalizacao']);
      this.common.loading.dismiss();
    }, (error) => {
      console.log(error);
      this.common.loading.dismiss();
    });
  }

}
