import { Usuario } from './usuario.interface';

export interface Feed {
    id?: string;
    titulo?: string;
    texto?: string;
    imagem?: string;
    dataCriacao?: any;
    privado?: boolean;
    compartilhar?: boolean;
    usuario?: Usuario;
    dataUltimaAtualizacao?: any;
    origemImagem?: string;
    
    idFeedOriginal?: string;
    usuarioCompartilhou?: Usuario;
    dataCompartilhamento?: any;
}

// export class Feed {
//     public id: string;
//     public titulo: string;
//     public texto: string;
//     public imagem: string;
//     public dataCriacao: Date;
//     public privado: boolean;
//     public compartilhar: boolean;
//     public usuario: Usuario;

//     public idFeedOriginal: string;
//     public usuarioCompartilhou: Usuario;
//     public dataCompartilhamento: Date;

//     constructor(id: string,
//                 titulo: string,
//                 texto: string,
//                 imagem: string,
//                 privado: boolean,
//                 compartilhar: boolean,
//                 usuario: Usuario) {
//         this.id = id;
//         this.titulo = titulo;
//         this.texto = texto;
//         this.imagem = imagem;
//         this.dataCriacao = new Date();
//         this.privado = privado;
//         this.compartilhar = compartilhar;
//         this.usuario = usuario;
//     }
// }


