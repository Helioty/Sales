import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ClienteGet } from 'src/app/services/cliente/cliente.interface';
import { ClienteService } from 'src/app/services/cliente/cliente.service';
import { CommonService } from 'src/app/services/common/common.service';
import { PedidoHeader } from 'src/app/services/pedido/pedido.interface';
import { PedidoService } from 'src/app/services/pedido/pedido.service';

@Component({
  selector: 'app-adicionar-endereco',
  templateUrl: './adicionar-endereco.component.html',
  styleUrls: ['./adicionar-endereco.component.scss'],
})
export class AdicionarEnderecoComponent implements OnInit {
  @Input() cliente: ClienteGet;

  hasCadastrado = false;

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
    await this.common.showLoader();
    if (this.hasCadastrado) {
      this.setPedidoCliente(this.cliente.cgccpf, this.cliente).subscribe({
        next: () => {
          this.common.loading.dismiss();
          this.close(true, null);
        },
        error: () => this.common.loading.dismiss(),
      });
    } else {
      this.atualizaCadastroCliente(this.cliente)
        .pipe(
          tap({
            next: () => {
              this.hasCadastrado = true;
            },
            error: () => {
              this.common.loading.dismiss();
            },
          }),
          switchMap(() => this.setPedidoCliente(this.cliente.cgccpf, this.cliente))
        )
        .subscribe({
          next: () => {
            this.common.loading.dismiss();
            this.close(true, null);
          },
          error: () => this.common.loading.dismiss(),
        });
    }
  }

  /**
   * @author helio.souza
   * @param clienteDoc CPF/CNPJ do cliente.
   * @param cliente Dados do Cliente.
   */
  setPedidoCliente(clienteDoc: string, cliente: ClienteGet): Observable<PedidoHeader> {
    const numPedido = this.pedidoService.getPedidoNumero();
    return this.pedidoService.adicionarCliente(numPedido, clienteDoc, cliente);
  }

  /**
   * @author helio.souza
   * @param cliente
   */
  atualizaCadastroCliente(cliente: ClienteGet): Observable<any> {
    return this.clienteService.postClienteAlteracao(cliente);
  }
}
