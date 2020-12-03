import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, AlertController, NavController, IonInput } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { NavigationExtras } from '@angular/router';
import { ProdutoPesquisaService } from 'src/app/services/produto-pesquisa/produto-pesquisa.service';
import { Produto } from 'src/app/class/produto';

@Component({
  selector: 'app-produto-pesquisa',
  templateUrl: './produto-pesquisa.page.html',
  styleUrls: ['./produto-pesquisa.page.scss'],
})
export class ProdutoPesquisaPage implements OnInit {
  @ViewChild('ip1', { static: true }) input1: IonInput;
  @ViewChild('ip2', { static: true }) input2: IonInput;
  @ViewChild('ip3', { static: true }) input3: IonInput;
  @ViewChild('ip4', { static: true }) input4: IonInput;
  @ViewChild('ip5', { static: true }) input5: IonInput;

  public taskScanner: any;
  public valorScanner: string;
  public focusStatus = true;


  // controle de exibição
  public pesquisaDetalhada = false;
  public pesquisando = false;
  public foco = false;
  public inputFoco = 0;

  // propriedades da pesquisa
  public soComEstoque = true;
  public p1 = 1;
  public p2 = 20;


  public pesquisaItems: Produto[] = [];

  constructor(
    public alertCtrl: AlertController,
    public common: CommonService,
    public pedidoS: PedidoService,
    public pesquisa: ProdutoPesquisaService,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.focusOn();
    this.common.goToFullScreen();
  }

  ionViewDidEnter() {
    this.common.goToFullScreen();
  }

  ionViewWillLeave() {
    this.focusOff();
  }

  ionViewDidLeave() { }

  // Cria o loop que da foco no input
  focusOn() {
    this.taskScanner = setInterval(() => {
      try {
        this.valorScanner = '';
        if (this.focusStatus) {
          const scanners = document.body.getElementsByClassName('scanner');
          for (const i in scanners) {
            if (Number(i) === (scanners.length - 1)) {
              (scanners[i] as HTMLInputElement).focus();
            }
          }
        }
      } catch (error) { }
    }, 350);
  }

  focusPlay() {
    this.focusStatus = true;
  }

  focusPause() {
    this.focusStatus = false;
    const scanners = document.body.getElementsByClassName('scanner');
    for (const i in scanners) {
      if (Number(i) === (scanners.length - 1)) {
        (scanners[i] as HTMLInputElement).blur();
      }
    }
  }

  // Encerra o loop de foco no input
  focusOff() {
    clearInterval(this.taskScanner);
  }

  scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusPause();
        const codigo: string = evento.target.value;

        if (codigo.substring(0, 1) === 'P') {
          this.pedidoS.setCardPedido(codigo);
          this.focusPlay();
        } else {
          this.focusPlay();
        }
      }
    } catch (error) {
      this.focusPlay();
    }
  }

  async adicionarCartaoPedido() {
    const alert = await this.alertCtrl.create({
      header: 'Cartão Pedido',
      cssClass: 'ion-alert-input',
      inputs: [
        {
          name: 'codigo',
          type: 'text',
          placeholder: 'Digite o codigo do cartão!'
        }
      ],
      buttons: ['CANCELAR', {
        text: 'ADICIONAR',
        handler: (data: any) => {
          this.pedidoS.setCardPedido(data.codigo);
        }
      }]
    });
    alert.onDidDismiss().finally(() => { this.focusPlay(); });
    await alert.present().then(() => {
      this.focusPause();
    });
  }

  openClientePage() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'back',
        paginaAnterior: 'produto-pesquisa'
      }
    };
    this.navControl.navigateForward(['/cliente'], navigationExtras);
  }

  showPesquisa() {
    this.pesquisaDetalhada = !this.pesquisaDetalhada;
  }

  setInputComFoco(acao: string) {
    let input = '';
    if (acao === 'mais') {
      this.inputFoco++;
      input = this.inputFoco.toString();
    } else if (acao === 'menos') {
      this.inputFoco--;
      input = this.inputFoco.toString();
    }

    switch (input) {
      case '1':
        this.inputFoco = 1;
        this.input1.setFocus();
        break;

      case '2':
        this.inputFoco = 2;
        this.input2.setFocus();
        break;

      case '3':
        this.inputFoco = 3;
        this.input3.setFocus();
        break;

      case '4':
        this.inputFoco = 4;
        this.input4.setFocus();
        break;

      case '5':
        this.inputFoco = 5;
        this.input5.setFocus();
        break;

      default:
        this.inputFoco = 0;
        this.common.goToFullScreen();
        console.log('case-default');
        break;
    }
  }

  async pesquisar() {
    const value = this.input1.value.toString();
    let codigo: number;
    if (value === '' || value === undefined) {
      codigo = null;
    } else {
      codigo = parseInt(value);
    }
    this.pesquisando = true;
    await this.pesquisa.getPesquisaDetalhada({
      codEmpresa: localStorage.getItem('empresa'),
      codigo, descricao: this.input2.value.toString(),
      fornecedor: this.input3.value.toString(),
      modelo: this.input4.value.toString(),
      linha: this.input5.value.toString(),
      p1: parseInt(this.p1.toString()),
      p2: parseInt(this.p2.toString()),
      soComEstoque: this.soComEstoque
    }).then((result: any) => {
      console.log(result);
      this.pesquisaItems = result.content;
      this.pesquisaDetalhada = false;
      this.pesquisando = false;
    }).catch(err => {
      this.pesquisando = false;
      console.log(err);
    });
  }

  goToProdutoPage(produto: Produto) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paginaSeguinte: 'pedido-sacola',
        paginaAnterior: 'produto-pesquisa',
        produto: JSON.stringify(produto)
      }
    };
    this.navControl.navigateForward(['/produto'], navigationExtras);
  }

}
