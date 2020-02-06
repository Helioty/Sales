import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PedidoServiceService {

  public tipoConexao: string;
  public exibeBotaoComprar: boolean = false;
  public executaPedidoRapido: boolean = false;
  public alteracaoItemPedido: boolean = false;
  
  public noCard: boolean = false;
  public enderecoSelected: boolean = false;
  public valorFrete = 0;

  public opcaoRetirada: any = ['IMEDIATA', 'POSTERIOR', 'ENTREGA'];
  
  public codigoTipoRetirada;
  
  public condicao;
  

  public statusPedido;  // controla pedido; 'I' INCLUSÃO , 'M' MANUTENCAO
  public sistuacaoPedido;  // controla pedido, A = ABERTO , F = FINALIZADO
  
  public ItensPedidoAdd: any;
  public nomeCliente: String = '';
  

  // PEDIDO EM MANUTENÇÃO
  public pedidoHeader: any;
  public tipoRetirada: any;
  public tipoDocumento: any;
  public qtdBasketItens: number = 0;

  public clientSelected: boolean = false;
  public docCliente: string = '';
  public dadosCliente: any;

  public cardSelected: boolean = false;
  public codigoCartaoPedido: any;
  public codigoBarraCartaoPedido: any;

  constructor() { }


  public limpaDadosPedido() {
    this.valorFrete = 0;
    this.enderecoSelected = false;
    this.codigoCartaoPedido = 0;
    this.cardSelected = false;

    this.clientSelected = false;
    this.alteracaoItemPedido = false;
    // this.digitoPedido = '';
    this.sistuacaoPedido = 'N';
    this.tipoDocumento = '';
    this.qtdBasketItens = 0;
    // this.numPedido = '0';
    this.pedidoHeader = {};
    this.statusPedido = '';
    this.docCliente = '';
    this.nomeCliente = '';
  }
}
