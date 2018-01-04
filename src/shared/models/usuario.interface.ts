import { Contato } from './contato.interface';

export interface Usuario {
    email: string;
    //senha: string;
    nome?: string;
    contatos?: Contato[];
}
// export class Usuario {
//     public email: string;
//     public senha: string;
//     public nome: string;
//     public contatos: Contato[];

//     constructor(email: string, senha: string, nome: string, contatos: Contato[]) {
//         this.email = email;
//         this.senha = senha;
//         this.nome = nome;
//         this.contatos = contatos;
//     }
// }
