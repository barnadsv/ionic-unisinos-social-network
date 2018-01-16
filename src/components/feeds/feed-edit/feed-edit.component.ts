import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { normalizeURL } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from "@ionic-native/file";
import { ImageResizer } from '@ionic-native/image-resizer';

import { FeedService } from '../../../shared/services/feed.service';

import { Feed } from '../../../shared/models/feed.interface';

@Component({
    selector: 'app-feed-edit',
    templateUrl: './feed-edit.component.html'
})
export class FeedEditComponent implements OnInit {

    @Output() salvarFeedStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
    @Output() fileMessage: EventEmitter<{success: Boolean, message: string, error: string}>;
    id: string;
    editMode = false;
    feed = {} as Feed;
    feedImage: any;
    nativeFilePath: string;
    nativeUri: string;
    originalImageWidth: number;
    originalImageHeight: number;

    cameraOptions: CameraOptions = {
        quality: 100,
    	destinationType: this.camera.DestinationType.FILE_URI,      
        //destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        // targetWidth: 1000,
        // targetHeight: 1000,
        // correctOrientation: true
    } 
    
    photoLibraryOptions: CameraOptions = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,      
        //destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        // targetWidth: 1000,
        // targetHeight: 1000,
        // correctOrientation: true
    }
    constructor(private platform: Platform,
                private feedService: FeedService,
                private navCtrl: NavController,
                private navParams: NavParams,
                private camera: Camera,
                private file: File,
                private filePath: FilePath,
                private imageResizer: ImageResizer) { 

            this.salvarFeedStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();
            this.fileMessage = new EventEmitter<{success: Boolean, message: string, error: string}>();

            this.feedService.salvarFeedMessage.subscribe(
                (resposta) => {
                this.salvarFeedStatus.emit(resposta);
                }
            );

    }

    ngOnInit() {
        const feedParams: Feed = this.navParams.get('feed');
        if (feedParams !== null) {
            this.feed = feedParams;
            this.editMode = true;
            this.id = this.feed.id;
        } else {
            this.editMode = false;
            this.id = '';
            this.feed.titulo = '';
            this.feed.texto = '';
            this.feed.imagem = '';
        }
    }

    onSubmit() {
        if (this.editMode) {
            this.feedService.salvarFeed(this.id, this.feed);
        } else {
            this.feedService.salvarFeed('', this.feed);
        }
        this.navigateAway();
    }

    onCancel() {
        this.navigateAway();
    }

    navigateAway() {
        this.navCtrl.setRoot('FeedsPage');
    }

    openGallery (): void {
        console.log('open gallery');
        const self = this;
        this.camera.getPicture(this.photoLibraryOptions)
            .then(file_uri => {

                const nome_arquivo = file_uri.substring(file_uri.lastIndexOf('/') + 1);

                this.nativeFilePath = file_uri;
                if (this.platform.is('android')) {
                    this.filePath.resolveNativePath(file_uri)
                        .then(filePath => {
                            this.nativeFilePath = filePath;

                            let file_size: number = 0;
                            this.file.resolveLocalFilesystemUrl(filePath)
                                .then(fileEntry => {

                                    self.nativeUri = normalizeURL(fileEntry.nativeURL);
                                    let localUri = '';
                                    if (self.nativeUri.indexOf('file://') !== -1) {
                                        localUri = self.nativeUri.replace('file://', '');
                                    }
                                    
                                    this.getMeta(localUri, function(width, height) {
                                        self.originalImageWidth = width;
                                        self.originalImageHeight = height;
                                        console.log('ORIGINAL file width: ' + width);
                                        console.log('ORIGINAL file height: ' + height);
                                        fileEntry.getMetadata(metadata => {
                                            file_size = metadata.size;
                                            console.log('ORIGINAL file size: '+ file_size);

                                            let quality = self.getQuality(file_size);
                                            let width = 0;
                                            let height = 0;

                                            if (self.originalImageWidth > 1200 || self.originalImageHeight > 1024) {
                                                if (self.originalImageWidth > self.originalImageHeight) {
                                                    width = 1200;
                                                    height = Math.floor(self.originalImageHeight/self.originalImageWidth * 1200);
                                                } else {
                                                    height = 1024;
                                                    width = Math.floor(self.originalImageWidth/self.originalImageHeight * 1024);
                                                }
                                                self.imageResizer.resize({
                                                    uri: file_uri,
                                                    quality: quality,
                                                    width: width,
                                                    height: height,
                                                    fileName: nome_arquivo
                                                }).then(uri => {
                                                    self.getFileEntry(uri)
                                                }, (err) => {
                                                    console.log(err);
                                                })
                                            } else {
                                                self.getFileEntry(self.nativeUri);
                                            }

                                        }, error => {
                                            console.log(error);
                                        })
                                    });

                            });

                        });

                } else {

                    let file_size: number = 0;
                    this.file.resolveLocalFilesystemUrl(file_uri)
                        .then(fileEntry => {

                            this.getMeta(file_uri, function(width, height) {
                                self.originalImageWidth = width;
                                self.originalImageHeight = height;
                                console.log('ORIGINAL file width: ' + width);
                                console.log('ORIGINAL file height: ' + height);

                                fileEntry.getMetadata(metadata => {
                                    file_size = metadata.size;
                                    console.log('ORIGINAL file size: '+ file_size);
                                    
                                    let quality = self.getQuality(file_size);
                                    let width = 0;
                                    let height = 0;

                                    if (self.originalImageWidth > 1200 || self.originalImageHeight > 1024) {
                                        if (self.originalImageWidth > self.originalImageHeight) {
                                            width = 1200;
                                            height = Math.floor(self.originalImageHeight/self.originalImageWidth * 1200);
                                        } else {
                                            height = 1024;
                                            width = Math.floor(self.originalImageWidth/self.originalImageHeight * 1024);
                                        }
                                        self.imageResizer.resize({
                                            uri: file_uri,
                                            quality: quality,
                                            width: width,
                                            height: height,
                                            fileName: nome_arquivo
                                        }).then(uri => {
                                            self.getFileEntry(uri)
                                        }, (err) => {
                                            console.log(err);
                                        })
                                    } else {
                                        self.getFileEntry(file_uri);
                                    }
                                }, error => {
                                    console.log(error);
                                })
                            });

                    })

                }

            }, (error) => console.log(error));
    }

    openCamera (): void {
        console.log('open camera');
        const self = this;
        this.camera.getPicture(this.cameraOptions)
            .then(file_uri => {
                const nome_arquivo = file_uri.substring(file_uri.lastIndexOf('/') + 1);

                this.getMeta(file_uri, function(width, height) {
                    self.originalImageWidth = width;
                    self.originalImageHeight = height;
                    console.log('ORIGINAL file width: ' + width);
                    console.log('ORIGINAL file height: ' + height);
                });

                let file_size: number = 0;
                this.file.resolveLocalFilesystemUrl(file_uri)
                    .then(fileEntry => {

                        this.getMeta(file_uri, function(width, height) {
                            self.originalImageWidth = width;
                            self.originalImageHeight = height;
                            console.log('ORIGINAL file width: ' + width);
                            console.log('ORIGINAL file height: ' + height);

                            fileEntry.getMetadata(metadata => {
                                file_size = metadata.size;
                                console.log('ORIGINAL file size: '+ file_size);
                                
                                let quality = self.getQuality(file_size);
                                let width = 0;
                                let height = 0;

                                if (self.originalImageWidth > 1200 || self.originalImageHeight > 1024) {
                                    if (self.originalImageWidth > self.originalImageHeight) {
                                        width = 1200;
                                        height = Math.floor(self.originalImageHeight/self.originalImageWidth * 1200);
                                    } else {
                                        height = 1024;
                                        width = Math.floor(self.originalImageWidth/self.originalImageHeight * 1024);
                                    }
                                    self.imageResizer.resize({
                                        uri: file_uri,
                                        quality: quality,
                                        width: width,
                                        height: height,
                                        fileName: nome_arquivo
                                    }).then(uri => {
                                        self.getFileEntry(uri);
                                    }, (err) => {
                                        console.log(err);
                                    })
                                } else {
                                    self.getFileEntry(file_uri);
                                }
                            }, error => {
                                console.log(error);
                            });
                        });

                })

            });
    }

    getFileEntry(imageFileUri) {
        this.file.resolveLocalFilesystemUrl(imageFileUri)
            .then(fileEntry => {

                fileEntry.getMetadata(metadata => {
                    console.log('RESIZED file size: '+ metadata.size);
                })

                console.log('Normalized imageFileUri: ' + normalizeURL(imageFileUri));
                console.log('Normalized fileEntry.nativeURL: ' + normalizeURL(fileEntry.nativeURL));
                console.log('Normalized fileEntry.toInternalURL(): ' + normalizeURL(fileEntry.toInternalURL()))
                let nativeUri = normalizeURL(fileEntry.nativeURL);
                if (nativeUri.indexOf('file://') !== -1) {
                    nativeUri = nativeUri.replace('file://', '');
                }
                this.getMeta(nativeUri, function(width, height) {
                    console.log('RESIZED file width: ' + width);
                    console.log('RESIZED file height: ' + height);
                });
                this.feed.imagem = normalizeURL(nativeUri);
            })
            .catch(error => {
                console.log(error);
                if (error.code === 1) {
                    this.fileMessage.emit({success: false, message: null, error: "file/not-found"})
                } else {
                    this.fileMessage.emit({success: false, message: null, error: error.code})
                }
            });
    }

    getMeta(url, callback){  
        if (url.indexOf('file://') !== -1) {
            url = url.replace('file://', '');
        }
        let img = new Image();
        img.addEventListener("load", function(){
            callback(this.naturalWidth, this.naturalHeight)
        });
        img.src = url;
    }

    getQuality(fileSize) {
        let quality = 100;
        if (fileSize > 8000000) {
            quality = 10;
        } else if (fileSize > 7000000) {
            quality = 20;
        } else if (fileSize > 6000000) {
            quality = 30;
        } else if (fileSize > 5000000) {
            quality = 40;
        } else if (fileSize > 4000000) {
            quality = 50;
        } else if (fileSize > 3000000) {
            quality = 60;
        } else if (fileSize > 2000000) {
            quality = 65;
        } else if (fileSize > 1000000) {
            quality = 70;
        } else if (fileSize > 800000) {
            quality = 75;
        } else if (fileSize > 600000) {
            quality = 80;
        } else if (fileSize > 400000) {
            quality = 85;
        } else if (fileSize > 200000) {
            quality = 90;
        } else if (fileSize > 100000) {
            quality = 95;
        } else {
            quality = 100;
        }
        return quality;
    }

}
