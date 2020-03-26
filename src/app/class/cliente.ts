export class Cliente {
    cgccpf: string;
    identidade: string;
    nome: string;
    recnum: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    natureza: string;
    empresa: Empresa;
    tipo: Tipo;
    emails: any[];
    celulares: any[];
    telefones: any[];
    enderecos: any[];
}

export class Endereco {
    id: Sequence;
    cd_status: string;
    tp_ende: string;
    ds_ende: string;
    nu_ende: string;
    ds_compl: string;
    ds_bairro: string;
    ds_cep: string;
    ds_uf: string;
    nu_praca: number;
    ds_obs: string;
    nu_referencia_pessoal: string;
    cd_inscricao: string;
    usuario_cadastrou: string;
    latitude: string;
    longitude: string;
    cidade: string;
}

export class Empresa {
    id: number;
}

export class Sequence {
    sequencialId: number;
    clienteId: string;
}

export class Tipo {
    id: number;
}

export class DataCli {
    id: string;
    cgccpf: string;
    identidade: string;
    nome: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    natureza: string;
    empresa: Empresa;
    email: string;
    ddd: string;
    celular: string;
    telefone: string;
    profissao: string;
}

export class Telefone {
    id: Sequence;
    referencia_pessoal: string;
    tipo: string;
    subtipo: string;
    observacao: string;
    recebe_nfe: boolean;
    status: string;
    ddd: string;
    numero: string;
    ramal: string;
}

export class Celular {
    id: Sequence;
    referencia_pessoal: string;
    tipo: string;
    subtipo: string;
    observacao: string;
    recebe_nfe: boolean;
    status: string;
    ddd: string;
    numero: string;
    ramal: string;
}

export class Email {
    id: Sequence;
    referencia_pessoal: string;
    tipo: string;
    subtipo: string;
    observacao: string;
    recebe_nfe: string;
    status: string;
    email_site: string;
}

export class CamposParaNovoEndereco {
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
}
