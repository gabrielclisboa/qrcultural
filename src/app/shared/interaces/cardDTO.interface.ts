// models/card.dto.ts
export interface CardDto {
    id: number;
    descricao: string;
    titulo: string;
    imagem: string;
    monumentoId: number;
    monumento: any; // Você pode especificar um tipo mais específico se tiver um modelo para Monumento
}
