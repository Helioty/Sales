import { Component, OnInit } from '@angular/core';
import { BaseCommon } from 'src/commons/base-common';
import { BaseService } from 'src/app/services/base-service.service';
import { PedidoService } from 'src/app/services/pedido-service.service';

import { ENV } from 'src/environments/environment';
import { API_URL } from 'src/config/app.config';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  // Valor digitado no input de CPF/CNPJ
  private valorDigitado: any = "";

  // Controle da animação do skeleton
  public skeletonAni: boolean = false;

  // Controle da cor do background // by Ryuge
  public isBlue: boolean = false;
  public isGreen: boolean = false;
  public isOrange: boolean = false;

  // Controle da pesquisa de CPF/CNPJ
  public isCNPJ: boolean = false;
  public atualizaCadastro: boolean = false;
  public novoCadastro: boolean = false;

  // Dados do cliente.
  private dados: any;
  public mensagem: string;

  constructor(
    public common: BaseCommon,
    public baseService: BaseService,
    public pedidoService: PedidoService,
  ) { }

  ngOnInit() {
    this.setCor('blue')
  }

  ionViewWillEnter() {
    this.common.goToFullScreen()
  }

  ionViewDidEnter() {
    this.common.goToFullScreen()
  }

  ionViewWillLeave() {

  }

  ionViewDidLeave() {

  }

  testes() {
    this.skeletonAni = !this.skeletonAni;
    console.log(this.isBlue)
    console.log(this.isGreen)
    console.log(this.isOrange)
  }

  setCor(cor: string) {
    switch (cor) {
      case 'blue':
        this.isBlue = true;
        this.isGreen = false;
        this.isOrange = false;
        break;

      case 'green':
        this.isBlue = false;
        this.isGreen = true;
        this.isOrange = false;
        break;

      case 'orange':
        this.isBlue = false;
        this.isGreen = false;
        this.isOrange = true;
        break;

      default:
        break;
    }
  }

  // by Helio 08/10/2019
  // mascara dinamica
  dynamicMask(inputName: string) {
    if (this.valorDigitado.length > 2) {
      if (inputName == "cli") {
        if (this.valorDigitado != "" || this.valorDigitado != undefined) {
          this.valorDigitado = this.common.formata(this.valorDigitado, "CPFCGC")
        }
      }
    }
  }

  setEstado(estado: string) {
    switch (estado) {
      case 'atualizacao':
        this.setCor('green');
        break;

      case 'confirmacao':
        this.setCor('green');
        break;

      case 'novo':
        this.setCor('orange');
        break;

      case 'reset':
        this.setCor('blue');
        break;

      default:
        break;
    }
  }

  async getCliente(doc: string) {
    let clieDoc: string = doc.replace(/\D/g, '');
    let link: string = ENV.WS_CRM + API_URL + "cliente/" + clieDoc;
    this.baseService.get(link).then((result: any) => {
      this.dados = result;

      if (this.dados != undefined || this.dados != [] || this.dados != '') {
        this.pedidoService.dadosCliente = this.dados;
        this.isCNPJ = this.dados.natureza != "FISICA";
      }
    }, (error: any) => {
      if (error.json().detail) {
        this.mensagem = "Não encontramos o cadastro do cliente!";
        this.setEstado('novo');
      }
      else {
        this.common.showAlert("Atenção!", "Falha de processamento, tente novamente !!");
      }
    });
  }

}
