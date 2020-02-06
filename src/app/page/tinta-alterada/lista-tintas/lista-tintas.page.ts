import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseCommon } from '../../../../commons/base-common';

@Component({
  selector: 'app-lista-tintas',
  templateUrl: './lista-tintas.page.html',
  styleUrls: ['./lista-tintas.page.scss'],
})
export class ListaTintasPage implements OnInit {

  public tintas: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public common: BaseCommon,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.tintas = JSON.parse(params["tintas"]);
    });
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
