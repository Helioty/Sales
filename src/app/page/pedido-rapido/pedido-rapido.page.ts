import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { NavController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pedido-rapido',
  templateUrl: './pedido-rapido.page.html',
  styleUrls: ['./pedido-rapido.page.scss'],
})
export class PedidoRapidoPage implements OnInit {

  public taskScanner: any;
  public valorScanner: string;
  public focusStatus: boolean = true;

  public itens = [{
    nome: 'TV',
    qtd: 2,
    preco: 1999
  }, {
    nome: 'Geladeira',
    qtd: 1,
    preco: 1499
  }, {
    nome: 'Furadeira',
    qtd: 1,
    preco: 199
  }, {
    nome: 'Cama',
    qtd: 2,
    preco: 259
  }, {
    nome: 'Ventilador',
    qtd: 3,
    preco: 119
  }]

  constructor(
    public common: CommonService,
    public pedidoService: PedidoService,
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
    if (this.platform.is("cordova")) {
      this.taskScanner = setInterval(() => {
        try {
          this.valorScanner = "";
          if (this.focusStatus) {
            document.getElementById("scanner").focus();
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

  async scaneado(evento: any) {
    try {
      if (evento.target && evento.target.value.length >= 2) {
        this.focusPause();
        let codigo: string = evento.target.value;

        if (codigo.substring(0, 1) == "P") {
          this.pedidoService.setCardPedido(codigo);
          this.focusPlay();
        } else {

        }
      }
    } catch (error) {
      this.focusPlay();
    }
  }


  add(id: any) {
    this.itens[id].qtd++
  }

  rm(id: any) {
    this.itens[id].qtd--
  }
}
