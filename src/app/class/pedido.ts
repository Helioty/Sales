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

    constructor(
        id: number,
        empresa: string
    ) { }
}

export class PedidoItens {
    idEmpresa: number;
    numPedido: number;
    idProduto: string;
    descricao: string;
    embalagem: number;
    retiradas: Retiradas[];
    qtdTotal: number = 0;
    prcUnitario: number = 0;
    prcTotal: number = 0;
    imagem: string;

    constructor(
        idEmpresa: string,
        numPedido: number,
    ) { }
}

export class Retiradas {
    empresaRetirada: number;
    idDeposito: number;
    tipoRetirada: number;
    qtd: number;
    precoUnitario: number;

    constructor(
    ) { }
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

export class PedidoTable  {
    name: string; // Atributo do objeto AtualizaPedido
    value: string; // Valor do atributo
}