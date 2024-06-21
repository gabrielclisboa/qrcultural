export interface Card {
    id: Number;
    descricao: string;
    titulo: string;
    imagem: Blob;
    monumentoId: Number;
    monumento: any;
    $id?: any;
}