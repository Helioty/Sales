import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClienteGet } from 'src/app/services/cliente/cliente.interface';

@Component({
  selector: 'app-adicionar-endereco',
  templateUrl: './adicionar-endereco.component.html',
  styleUrls: ['./adicionar-endereco.component.scss'],
})
export class AdicionarEnderecoComponent implements OnInit {
  @Input() cliente: ClienteGet;

  constructor(private readonly modalCtrl: ModalController) {}

  ngOnInit(): void {}

  /**
   * @author helio.souza
   * @param hasRetorno Flag para informar se existe retorno. Default: false.
   * @param data Dados dos selecionados.
   */
  close(hasRetorno = false, data: ClienteGet = null): void {
    this.modalCtrl.dismiss({
      hasRetorno,
      retorno: data,
    });
  }

  cadastrar(data: any): void {}
}
