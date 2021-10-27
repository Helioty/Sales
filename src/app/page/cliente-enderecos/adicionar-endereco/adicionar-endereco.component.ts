import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClienteGet } from 'src/app/services/cliente/cliente.interface';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-adicionar-endereco',
  templateUrl: './adicionar-endereco.component.html',
  styleUrls: ['./adicionar-endereco.component.scss'],
})
export class AdicionarEnderecoComponent implements OnInit {
  @Input() cliente: ClienteGet;

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly pedidoService: PedidoService,
    private readonly clienteService: ClienteService,
    private readonly common: CommonService
  ) {}

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

  /**
   * @author helio.souza
   * @param data
   */
  async cadastrar(data: any): Promise<void> {
    await this.common.showLoaderCustom('Salvando...');
    const newCliente = { ...this.cliente, enderecos: [data, ...this.cliente.enderecos] };
    this.atualizaCadastroCliente(newCliente)
      .pipe(
        tap({
          next: () => {
            this.setPedidoCliente(newCliente);
            this.common.loading.dismiss();
            this.close(true, null);
          },
          error: () => {
            this.common.loading.dismiss();
          },
        })
      )
      .subscribe();
  }

  /**
   * @author helio.souza
   * @param cliente Dados do Cliente.
   */
  setPedidoCliente(cliente: ClienteGet): void {
    this.pedidoService.atualizarPedidoCliente(cliente);
  }

  /**
   * @author helio.souza
   * @param cliente Dados do Cliente.
   */
  atualizaCadastroCliente(cliente: ClienteGet): Observable<any> {
    return this.clienteService.postClienteAlteracao(cliente);
  }
}
