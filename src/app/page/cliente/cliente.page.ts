import { Component, OnInit } from '@angular/core';
import { BaseCommon } from '../../../commons/base-common';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {

  // Valor digitado no input de CPF/CNPJ
  public valorDigitado: any = "";

  // Controle da cor do background // by Ryuge
  public isBlue: boolean = false;
  public isGreen: boolean = false;
  public isOrange: boolean = false;

  public skeletonAni: boolean = false;

  constructor(
    public common: BaseCommon
  ) { }

  ngOnInit() {
    this.setCor('blue')
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
  
  mudarCor() {
    if (this.isBlue) {
      this.isBlue = false;
      this.isGreen = true;
      this.isOrange = false;
    }
    else if (this.isGreen) {
      this.isBlue = false;
      this.isGreen = false;
      this.isOrange = true;
    }
    else if (this.isOrange) {
      this.isBlue = true;
      this.isGreen = false;
      this.isOrange = false;
    }
  }


  // by Helio 08/10/2019
  // mascara dinamica
  dynamicMask(inputName: string) {
    if (this.valorDigitado.length > 2) {
      if (inputName == "cli") {
        if (this.valorDigitado != "" || this.valorDigitado != undefined) {
          let valorDigitado = this.valorDigitado.replace(/\D/g, '');
          this.valorDigitado = this.common.formata(valorDigitado, "CPFCGC")
        }
      }
    }
  }

}
