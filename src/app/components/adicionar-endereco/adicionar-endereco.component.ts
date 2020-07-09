import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-adicionar-endereco',
  templateUrl: './adicionar-endereco.component.html',
  styleUrls: ['./adicionar-endereco.component.scss'],
})
export class AdicionarEnderecoComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  close() {
    this.modalCtrl.dismiss();
  }

}
