export class Pedido {
    
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