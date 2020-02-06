import { Component, OnInit } from '@angular/core';
import { BaseCommon } from '../../../../commons/base-common';

@Component({
  selector: 'app-cliente-cadastro-edicao',
  templateUrl: './cliente-cadastro-edicao.page.html',
  styleUrls: ['./cliente-cadastro-edicao.page.scss'],
})
export class ClienteCadastroEdicaoPage implements OnInit {

  constructor(
    public common: BaseCommon
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
    this.common.goToFullScreen()
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter")
    this.common.goToFullScreen()
  }

}
