import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BaseCommon } from 'src/commons/base-common';

@Component({
  selector: 'app-produto-pesquisa',
  templateUrl: './produto-pesquisa.page.html',
  styleUrls: ['./produto-pesquisa.page.scss'],
})
export class ProdutoPesquisaPage implements OnInit {

  @ViewChild("scanner", { static: false }) scanned: any;
  public taskScanner: any;

  public valorScanner: string;

  constructor(
    public common: BaseCommon,
    private platform: Platform
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.focusOn()
    this.common.goToFullScreen()
  }

  ionViewDidEnter() {
    this.common.goToFullScreen()
  }

  focusOn() {
    // if (this.platform.is("cordova")) {
      this.taskScanner = setInterval(() => {
        try {
          this.scanned.setFocus();
        } catch (error) { }
      }, 300);
    // }
  }

  scaneado(evento: any) {
    console.log(evento)
    this.common.showAlertInfo(evento.target.value)
    this.valorScanner = ""
  }

}
