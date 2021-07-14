export class PedidoHeader {
  recnum: number;
  cod_empresa: number;
  numpedido: number;
  nome_cliente: string;
  codvend: number;
  condpag: string;
  descricao_condpag: string;
  qtdParcelas: number;
  msgJuros: string;
  tipodoc: string;
  descricao_tipodoc: string;
  totpedido: number;
  numitens: number;
  cgccpf_cliente: string;
  qtdpages: number;
  totalElements: number;
  dataEmissao: string;
  tipoEntrega: string;
  status: string;
  hora: string;
  seqEnderecoEntrega: number;
  frete: any;
  icmsRetido: number;
  valorTotalPedido: number;
  digito: number;
  cartaoPedido: number;
  barCodecartaoPedido: string;
  informarCliente: string;
  pesoTotal: number;
  descontoBrinde: number;
  user_allow_desconto: number;
  valorDesconto: number;
  percDesconto: number;
  valorEntrada: number;
  valorParcela: number;
  totalProdutos: number;
  canalVenda: number;
  sqltypeName: any;
}

export class PedidoCab {
  id: number;
  empresa: string;
  cliente: string;
  vendedor: string;
  dataEmissao: string;
  tipoEntrega: string;
  formaPagamento: string;
  numeroDeParcela: number;
  subTotal: number;
  frete: number;
  entrada: number;
  total: number;
  exigeAprovacao: boolean;

  constructor(id: number, empresa: string) {}
}

// export class PedidoItens {
//   idEmpresa: number;
//   numPedido: number;
//   idProduto: string;
//   descricao: string;
//   embalagem: number;
//   retiradas: Retiradas[];
//   qtdTotal: number = 0;
//   prcUnitario: number = 0;
//   prcTotal: number = 0;
//   imagem: string;

//   constructor(idEmpresa: string, numPedido: number) {}
// }

export class Retiradas {
  empresaRetirada: number;
  idDeposito: number;
  tipoRetirada: number;
  qtd: number;
  precoUnitario: number;

  constructor() {}
}

export class AtualizaPedido {
  cliente: string; // CPF do cliente
  vendedor: string; // Código do vendedor
  entrega: string;
  tipo_pagamento: string;
  condicao_pagto: string;
  seq_endereco_entrega: string; // Sequencial do Endereço de Entrega
  valor_entrada: number;
  basket: number;
}
