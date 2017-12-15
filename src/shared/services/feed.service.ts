import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from './auth.service';
import { UsuarioService } from './usuario.service';

import { Feed } from '../models/feed.interface';
import { Usuario } from '../models/usuario.interface';

@Injectable()
export class FeedService {

    private feeds: Feed[] = [];
    salvarFeedMessage = new Subject<{success: boolean, message: string, error: any}>();
    apagarFeedMessage = new Subject<{success: boolean, message: string, error: any}>();
    feedsAlterados = new Subject<Feed[]>();
    subscription: Subscription;

    constructor(private authService: AuthService,
                private usuarioService: UsuarioService) {
        let preFeeds = JSON.parse(localStorage.getItem('feeds'));
        if (preFeeds !== null) {
            this.feeds = preFeeds.filter
            ( feed => feed.privado === false ||
                ( feed.privado === true &&
                    ( feed.usuario.contatos.findIndex
                        (
                            contato => contato.email === this.usuarioService.getUsuarioAutenticado().email
                        ) > -1 ||
                      feed.usuario.email === this.usuarioService.getUsuarioAutenticado().email
                    )
                )
            );
        }
        if (this.feeds === null) {
            this.feeds = [];
        }
        this.subscription = this.usuarioService.usuarioAutenticadoAlterado.subscribe(
            (usuario: Usuario) => {
                if (usuario !== null) {
                    preFeeds = JSON.parse(localStorage.getItem('feeds'));
                    if (preFeeds !== null) {
                        this.feeds = preFeeds.filter
                        ( feed => feed.privado === false ||
                            ( feed.privado === true &&
                                ( feed.usuario.contatos.findIndex
                                    (
                                        contato => contato.email === this.usuarioService.getUsuarioAutenticado().email
                                    ) > -1 ||
                                feed.usuario.email === this.usuarioService.getUsuarioAutenticado().email
                                )
                            )
                        );
                    }
                }
                if (this.feeds === null) {
                    this.feeds = [];
                }
            }
        );

    }

    salvarFeed(id: string, feedAlterado: Feed, compartilhado = false) {
        console.log(feedAlterado);
        if (this.authService.isAutenticado()) {
            if (id === '') {
                id = this.guid();
                if (compartilhado === false) {
                    feedAlterado.id = id;
                    feedAlterado.usuario = this.usuarioService.getUsuarioAutenticado();
                    feedAlterado.dataCriacao = new Date();
                } else {
                    feedAlterado.idFeedOriginal = feedAlterado.id;
                    feedAlterado.id = id;
                }
                this.feeds.push(feedAlterado);
                localStorage.setItem('feeds', JSON.stringify(this.feeds));
                this.feedsAlterados.next(this.feeds.slice());
                const message = compartilhado === true ? 'Feed compartilhado com sucesso' : 'Feed salvo com sucesso.';
                this.salvarFeedMessage.next({success: true, message: message, error: null});
            } else {
                const indice = this.feeds.findIndex(feed => feed.id === id);
                if (indice !== -1) {
                    feedAlterado.id = id;
                    feedAlterado.usuario = this.usuarioService.getUsuarioAutenticado();
                    this.feeds[indice] = feedAlterado;
                    localStorage.setItem('feeds', JSON.stringify(this.feeds));
                    this.feedsAlterados.next(this.feeds.slice());
                    this.salvarFeedMessage.next({success: true, message: 'Feed salvo com sucesso.', error: null});
                } else {
                    this.salvarFeedMessage.next({success: false, message: null, error: 'salvar-feed/feed-nao-encontrado'});
                }
            }
        } else {
            this.salvarFeedMessage.next({success: false, message: null, error: 'salvar-feed/nao-autenticado'});
        }
    }

    apagarFeed(id: string) {
        if (this.authService.isAutenticado()) {
            if (id !== null && id !== '') {
                const indice = this.feeds.findIndex(feed => feed.id === id);
                if (indice !== -1) {
                    this.feeds.splice(indice, 1);
                    localStorage.setItem('feeds', JSON.stringify(this.feeds));
                    this.feedsAlterados.next(this.feeds.slice());
                } else {
                    this.apagarFeedMessage.next({success: false, message: null, error: 'apagar-feed/feed-nao-encontrado'});
                }
            }
        } else {
            this.apagarFeedMessage.next({success: false, message: null, error: 'apagar-feed/nao-autenticado'});
        }
    }

    getFeeds() {
        return this.feeds.slice(); // slice faz uma nova cópia do array de feeds...
    }

    getFeed(id: string): Feed {
        const feedEncontrado = this.feeds.find(feed => feed.id === id);
        if (typeof feedEncontrado !== 'undefined') {
            return feedEncontrado;
        } else {
            return null;
        }
    }

    // Gerando uuid sem garantia de não colisão, apenas para usar em protótipo de app
    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

}