import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { LoginValidateComponent } from 'src/app/components/login-validate/login-validate.component';
import { IAuth } from 'src/app/services/auth/auth.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-pedido-desconto',
  templateUrl: './pedido-desconto.page.html',
  styleUrls: ['./pedido-desconto.page.scss'],
})
export class PedidoDescontoPage implements OnInit {
  pedido: PedidoHeader;

  desconto = { valor: '', porcentagem: '' };

  isValidated = false;
  user: IAuth = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly common: CommonService,
    private readonly modal: ModalController,
    private readonly pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params) => (this.pedido = JSON.parse(params.pedido)),
    });
  }

  ionViewDidEnter(): void {
    this.getDesconto();
  }

  getDesconto(): void {
    this.pedidoService.getDescontoPedido(this.pedido.numpedido).subscribe({
      next: (desconto) => {
        console.log('Desconto: ', desconto);
      },
    });
  }

  /**
   * @author helio.souza
   * @param desconto
   */
  async setDesconto(desconto: number): Promise<void> {
    await this.common.showLoader();
    this.pedidoService
      .setDescontoPedido(this.pedido.numpedido, this.user.login, desconto)
      .subscribe({
        next: () => {
          this.common.loading.dismiss();
        },
        error: () => {
          this.common.loading.dismiss();
        },
      });
  }

  /**
   * @author helio.souza
   */
  async openLoginModal(): Promise<void> {
    const modal = await this.modal.create({
      component: LoginValidateComponent,
      cssClass: ['modal-login-validate'],
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data.existePesquisa) {
      this.user = data.retorno;
      this.isValidated = true;
    } else {
      this.isValidated = false;
    }
  }

  formatarPorcentagem(): void {
    const porcentagem = this.desconto.porcentagem.trim();
    const totalPedido =
      this.pedido.totpedido + this.pedido.descontoBrinde + this.pedido.valorDesconto;

    if (porcentagem?.length) {
      const desc = (parseFloat(porcentagem) / 100) * totalPedido;
      this.desconto.valor = isNaN(desc) ? '' : desc.toFixed(2);
    } else {
      this.common.showToast('formatarPorcentagem');
    }
  }

  formatarValor(): void {
    const valor = this.desconto.valor.trim();
    const totalPedido =
      this.pedido.totpedido + this.pedido.descontoBrinde + this.pedido.valorDesconto;

    if (valor?.length) {
      const desc = (parseFloat(valor) / totalPedido) * 100;
      this.desconto.porcentagem = isNaN(desc) ? '' : desc.toFixed(2);
    } else {
      this.common.showToast('formatarValor');
    }
  }
}
