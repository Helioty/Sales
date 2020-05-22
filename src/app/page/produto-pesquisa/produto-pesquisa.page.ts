
import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, AlertController, NavController, IonInput } from '@ionic/angular';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';
import { NavigationExtras } from '@angular/router';
import { ProdutoPesquisaService } from 'src/app/services/produto-pesquisa/produto-pesquisa.service';

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
  public foco = false;
  public inputFoco = 0;

  // propriedades da pesquisa
  public soComEstoque: boolean = true;
  public p1: number = 1;
  public p2: number = 20;


  public pesquisaItems: any[] = [];

  constructor(
    public alertCtrl: AlertController,
    public common: CommonService,
    public pedido: PedidoService,
    public pesquisa: ProdutoPesquisaService,
    private navControl: NavController,
    private platform: Platform,
  ) { }

  ngOnInit() {

  }

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

  ionViewDidLeave() {

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
          this.pedido.setCardPedido(data.codigo);
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

  async pesquisar(){
    let value = this.input1.value.toString();
    let codigo;
    if(value == "" || value == undefined){
      codigo = null;
    } else {
      codigo = parseInt(value);
    }
    await this.pesquisa.getPesquisaDetalhada({ codEmpresa: localStorage.getItem("empresa"), codigo, descricao: this.input2.value.toString(), fornecedor: this.input3.value.toString(), modelo: this.input4.value.toString(), linha: this.input5.value.toString(), p1: parseInt(this.p1.toString()), p2: parseInt(this.p2.toString()), soComEstoque: this.soComEstoque }).then( result => {
      console.log(result);
    }).catch(err=>{
      console.log(err);
    })
  }

}
