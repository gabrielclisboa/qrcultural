import { Card } from "./card.interface";

export interface MonumentoDTO {
    id: string;
    contextoHistorico: string;
    endereco: string;
    horarioFuncionamento: string;
    entrada: string;
    carrosel1: string;
    carrosel2: string;
    carrosel3: string;
    imagemPrincipal: string;
    card: Card;
}
