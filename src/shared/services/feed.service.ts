import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { File, FileEntry } from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import * as firebase from 'firebase';

import { AuthService } from './auth.service';
import { UsuarioService } from './usuario.service';

import { Feed } from '../models/feed.interface';

import { AngularFireList, AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class FeedService {

    public feedsRef: AngularFireList<Feed>;
    private feedRef: AngularFireObject<any>;
    private feedStorageRef: AngularFireStorageReference;
    private feed: Feed;
    private preFeeds: Feed[] = [];
    private feeds: Feed[] = [];
    private compartilhado: boolean = false;
    private feedId: string;

    fileTransfer: FileTransferObject;
    encodedImageFileUri: string;
    correctPath: string;
    currentName: string;

    salvarFeedMessage = new Subject<{success: boolean, message: string, error: any}>();
    apagarFeedMessage = new Subject<{success: boolean, message: string, error: any}>();
    feedsList = new Subject<Feed[]>();
    feedsAlterados = new Subject();
    subscription: Subscription;

    constructor(private platform: Platform,
                private afAuth: AngularFireAuth,
                private authService: AuthService,
                private db: AngularFireDatabase,
                private afStorage: AngularFireStorage,
                private usuarioService: UsuarioService,
                private readonly file: File,
                private transfer: FileTransfer) {

        //this.fileTransfer = this.transfer.create();
        this.platform.ready().then(() => {
            this.fileTransfer = this.transfer.create();
        });

        this.feedsRef = this.db.list<Feed>('feeds');

        this.afAuth.authState.subscribe(usuario => {
            if (!usuario) {
                this.feeds = [];
            }
            this.feedsList.next(this.feeds.slice());
            this.feedsAlterados.next();
        })

    }

    carregarFeeds() {
        this.feedsRef
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
                this.feedsList.next(this.feeds.slice());
                this.feedsAlterados.next();
                
            });
    }

    salvarFeed(id: string, feedAlterado: Feed, compartilhado = false) {
        if (this.authService.isAutenticado()) {
            this.compartilhado = compartilhado;
            let usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();
            if (id === '') {
                if (compartilhado === false) {
                    feedAlterado.usuario = usuarioAutenticado
                    feedAlterado.dataCriacao = firebase.database.ServerValue.TIMESTAMP;
                } else {
                    feedAlterado.idFeedOriginal = feedAlterado.id;
                    feedAlterado.dataCompartilhamento = firebase.database.ServerValue.TIMESTAMP;
                    feedAlterado.usuarioCompartilhou.nome = usuarioAutenticado.nome;
                }
                if (typeof feedAlterado.privado === 'undefined') {
                    feedAlterado.privado = false;
                }
                if (typeof feedAlterado.compartilhar === 'undefined') {
                    feedAlterado.compartilhar = false;
                }
                this.feed = feedAlterado;

                this.feedsRef.push(feedAlterado).then(
                    (feed) => {
                        if (feed.key !== null) {
                            this.feedId = feed.key;

                            if (compartilhado === true) {
                                this.feed.id = feed.key;
                                this.feedsRef.update(this.feedId, this.feed);
                            }

                            this.feedStorageRef = this.afStorage.ref(`/imagens/`+ this.feedId);
                            this.uploadImage(feedAlterado.imagem);
                        }
                    }, 
                    (error) => {
                        console.log(error);
                    }
                )
            } else {
                console.log(id);
                this.feedId = id;
                feedAlterado.usuario = usuarioAutenticado;
                feedAlterado.dataUltimaAtualizacao = firebase.database.ServerValue.TIMESTAMP;
                this.feedsRef.update(id, feedAlterado)
                    .then(ref => {
                        //this.salvarFeedMessage.next({success: true, message: 'Feed salvo com sucesso.', error: null});
                        this.feedStorageRef = this.afStorage.ref(`/imagens/`+ id);
                        this.uploadImage(feedAlterado.imagem);
                        
                    })
                    .catch(error => {
                        this.salvarFeedMessage.next({success: false, message: null, error: error.code});
                    })
            }
        } else {
            this.salvarFeedMessage.next({success: false, message: null, error: 'salvar-feed/nao-autenticado'});
        }
    }

    apagarFeed(id: string) {
        if (this.authService.isAutenticado()) {
            this.feedsRef.remove(id)
                .then(ref => {
                    this.apagarFeedMessage.next({success: true, message: 'Feed removido com sucesso.', error: null});
                })
                .catch(error => {
                    this.apagarFeedMessage.next({success: false, message: null, error: error.code});
                })

        } else {
            this.apagarFeedMessage.next({success: false, message: null, error: 'apagar-feed/nao-autenticado'});
        }
    }
    
    apagarFeeds() {
        if (this.authService.isAutenticado()) {
            this.feedsRef.remove();
            this.feeds = [];
        }
    }

    getFeeds() {
        this.carregarFeeds();
        if (this.authService.isAutenticado()) {
            return this.feeds;
        } else {
            return null;
        }
    }

    getFeed(id: string): Feed {

        if (this.authService.isAutenticado()) {
            const filteredFeeds = this.feeds.filter(feed => feed.id === id);
            if (filteredFeeds.length === 1) {
                return filteredFeeds[0];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    carregaFeed(id: string) {
        this.feedRef = this.db.object('feeds/' + id);
        this.feedRef.valueChanges().subscribe(feed => {
            this.feed = feed;
        })
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

    

    uploadImage(imageFileUri: any) {
        
        this.encodedImageFileUri = encodeURI(imageFileUri.toString())

        this.currentName = imageFileUri.substr(imageFileUri.lastIndexOf('/') + 1);
        this.correctPath = imageFileUri.substr(0, imageFileUri.lastIndexOf('/') + 1);
        
        console.log(`imageFileUri: ` + imageFileUri);
        console.log(`currentName: ` + this.currentName);
        console.log(`correctPath: ` + this.correctPath);
        console.log(`encodedImageFileUri: ` + this.encodedImageFileUri);

        if (imageFileUri.indexOf('http') !== -1 && imageFileUri.indexOf('http://localhost') === -1) {
            let tempDir = '';
            if (this.platform.is('android')) {
                tempDir = this.file.externalDataDirectory;
            }
            if (this.platform.is('ios')) {
                tempDir = this.file.tempDirectory;
            } 
            this.fileTransfer.download(this.encodedImageFileUri, tempDir + this.currentName, true)
                .then((entry) => {
                    (<FileEntry>entry).file(file => {
                        this.readFile(file);
                    })
                })
                .catch(err => {
                    console.log(err)
                });
        } else {
            if (imageFileUri.indexOf('http://localhost:') !== -1) {
                imageFileUri = imageFileUri.substring(imageFileUri.indexOf('http://localhost:') + 21); // http:localhost:0000
            }
            if (imageFileUri.indexOf('file://') === -1) {
                //imageFileUri = imageFileUri.replace('file://', '');
                imageFileUri = 'file://' + imageFileUri;
            }
            this.correctPath = imageFileUri;
            this.file.resolveLocalFilesystemUrl(imageFileUri)
                .then(entry => (<FileEntry>entry).file(file => {
                    this.readFile(file);
                }))
                .catch(err => {
                    console.log(err)
                });
        }

    }

    readFile(file: any) {
        const reader = new FileReader();
        //let url: Observable<string>;
        reader.onloadend = () => {
            //const formData = new FormData();
            const imgBlob = new Blob([reader.result], {type: file.type});

            const uploadTask = this.storeImage(imgBlob);
            uploadTask.then().then(snapshot => {
                console.log('achou snapshot de put da imagem');
                if (snapshot.metadata.downloadURLs.length > 0) {
                    const url = snapshot.metadata.downloadURLs[0];
                    if (url !== null) {
                        this.atualizarUrl(url);
                    } else {
                        this.feedStorageRef.getDownloadURL()
                            .subscribe(url => {
                                this.atualizarUrl(url);
                            }, error => {
                                console.log(error);
                            });
                    }
                }
            })

        };
        reader.readAsArrayBuffer(file);
    }

    storeImage(imageData: any): AngularFireUploadTask {
        return this.feedStorageRef.put(imageData, {contentType: 'image/jpeg'});
    }
    
    atualizarUrl(url: string) {
        this.feed.imagem = url;
        this.feedsRef.update(this.feedId, this.feed)
            .then(ref => {
                const message = this.compartilhado === true ? 'Feed compartilhado com sucesso' : 'Feed salvo com sucesso.';
                this.salvarFeedMessage.next({success: true, message: message, error: null});
            })
            .catch(error => {
                this.salvarFeedMessage.next({success: false, message: null, error: error.code});
            })
    }

}
