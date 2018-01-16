import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

// import { NavController } from 'ionic-angular/navigation/nav-controller';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { Subscription } from 'rxjs/Subscription';

import { FeedService } from '../../../shared/services/feed.service';

import { Feed } from '../../../shared/models/feed.interface';
import { Usuario } from '../../../shared/models/usuario.interface';

@Component({
    selector: 'app-feed-list',
    templateUrl: './feed-list.component.html'
})
export class FeedListComponent implements OnInit, OnDestroy {

    @Output() apagarFeedStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
    @Output() feedsAlterados: EventEmitter<boolean>;
    subscription: Subscription;
    preFeeds: Feed[];
    feeds: Feed[];
    offset: number = 0;

    usuarioAutenticado: Usuario;
    
    constructor(private feedService: FeedService,
                // private navCtrl: NavController,
                private afAuth: AngularFireAuth) { 

        this.apagarFeedStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
        this.feedsAlterados = new EventEmitter<boolean>();

        this.feedService.feedsList.subscribe(feeds => {
            this.feeds = feeds;
        })

        this.subscription = this.feedService.feedsAlterados.subscribe(
            () => {
                this.feedsAlterados.emit(true);
            }
        );

        this.feedService.apagarFeedMessage.subscribe(
            (resposta) => {
                this.apagarFeedStatus.emit(resposta);
            }
        );

        const self = this;
        const starCountRef = firebase.database().ref('.info/serverTimeOffset');
        starCountRef.on('value', function(snapshot) {
            self.offset = parseInt(snapshot.toJSON().toString());
        });

    }

    ngOnInit() {
        this.carregarFeeds();
    }

    carregarFeeds() {
        this.feedService.feedsRef
            .snapshotChanges()
            .map(changes => {
                return changes.map(c => ({
                    id: c.payload.key, ...c.payload.val()
                }))
            })
            .subscribe(feeds => {
                
                this.preFeeds = feeds;
                let user = this.afAuth.auth.currentUser;
                
                if (this.preFeeds !== null && user !== null) {
                    this.feeds = this.preFeeds.filter
                    ( feed => {
                        if (typeof feed.usuario.contatos === 'undefined') {
                            feed.usuario.contatos = [];
                        }
                        return feed.privado === false ||
                        ( feed.privado === true &&
                            ( (feed.usuario.contatos.length > 0 && feed.usuario.contatos.findIndex( contato => contato.email === user.email ) > -1) ||
                                feed.usuario.email === user.email
                            )
                        )
                    });
                }

                if (this.feeds === null) {
                    this.feeds = [];
                }

                this.feeds = this.sortFeeds(this.feeds);
                this.feedsAlterados.emit(true);
                
            });
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // onNovoFeed() {
    //     this.navCtrl.push('FeedEditPage', { feed: null });
    // }

    sortFeeds(feeds: Feed[]): Feed[] {
        feeds.sort(function (a, b) {
        const data_a = a.dataCompartilhamento !== undefined ? a.dataCompartilhamento : a.dataCriacao;
        const data_b = b.dataCompartilhamento !== undefined ? b.dataCompartilhamento : b.dataCriacao;
        if (data_a > data_b) {
            return -1;
        }
        if (data_a < data_b) {
            return 1;
        }
        return 0;
        });
        return feeds;
    }

}
