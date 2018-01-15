import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { normalizeURL } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { FilePath } from '@ionic-native/file-path';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from "@ionic-native/file";
import { ImageResizer } from '@ionic-native/image-resizer';
// import { PhotoLibrary } from '@ionic-native/photo-library';
// import { FirebaseApp } from 'angularfire2';

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

        // this.photoLibrary.requestAuthorization().then(() => {
        //     this.photoLibrary.getLibrary().subscribe({
        //       next: library => {
        //         library.forEach(function(libraryItem) {
        //           console.log(libraryItem.id);          // ID of the photo
        //           console.log(libraryItem.photoURL);    // Cross-platform access to photo
        //           console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
        //           console.log(libraryItem.fileName);
        //           console.log(libraryItem.width);
        //           console.log(libraryItem.height);
        //           console.log(libraryItem.creationDate);
        //           console.log(libraryItem.latitude);
        //           console.log(libraryItem.longitude);
        //           console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
        //         });
        //       },
        //       error: err => { console.log('could not get photos'); },
        //       complete: () => { console.log('done getting photos'); }
        //     });
        //   })
        //   .catch(err => console.log('permissions weren\'t granted'));

          this.camera.getPicture(this.photoLibraryOptions)
            .then(file_uri => {
                this.nativeFilePath = file_uri;
                if (this.platform.is('android')) {
                    this.filePath.resolveNativePath(file_uri)
                        .then(filePath => {
                            this.nativeFilePath = filePath;
                            this.getFileEntry(this.nativeFilePath);
                            //let currentName = file_uri.substring(file_uri.lastIndexOf('/') + 1, file_uri.lastIndexOf('?'));
                        });
                } else {
                    this.getFileEntry(this.nativeFilePath);
                    //var currentName = file_uri.substr(file_uri.lastIndexOf('/') + 1);
                }
                //this.getFileEntry(file_uri)
            }, (error) => console.log(error));
        //   .then((imageData) => {
        //       // imageData is either a base64 encoded string or a file URI
        //       // If it's base64:
        //       let base64Image = 'data:image/jpeg;base64,' + imageData;
        //       this.feed.imagem = base64Image;
        //       // console.log(this.feed.id);
        //       // this.storeImage(base64Image);
        //       //this.storageRef.getDownloadURL().subscribe(url => this.feed.imagem = url);
        // }, (err) => {
        //     console.log(err)
        // });
    }

    openCamera (): void {
        console.log('open camera');

        this.camera.getPicture(this.cameraOptions)
            .then(file_uri => {
                const nome_arquivo = file_uri.substring(file_uri.lastIndexOf('/') + 1);

                let file_size: number = 0;
                this.file.resolveLocalFilesystemUrl(file_uri)
                    .then(fileEntry => {
                        fileEntry.getMetadata(metadata => {
                            file_size = metadata.size;
                            console.log('file size: '+ file_size);
                        })
                    })

                this.imageResizer.resize({
                    uri: file_uri,
                    quality: 60,
                    width: 1280,
                    height: 1280,
                    fileName: nome_arquivo
                }).then(uri => {
                    this.getFileEntry(uri)
                }, (err) => {
                    console.log(err)
                })
            });
            // .then((imageData) => {
            //     // imageData is either a base64 encoded string or a file URI
            //     // If it's base64:
            //     let base64Image = 'data:image/jpeg;base64,' + imageData;
            //     this.feed.imagem = base64Image;
            //     // console.log(this.feed.id);
            //     // this.storeImage(base64Image);
            //     //this.storageRef.getDownloadURL().subscribe(url => this.feed.imagem = url);
            // }, (err) => {
            //     console.log(err)
            // });
    }

    getFileEntry(imageFileUri) {
        this.file.resolveLocalFilesystemUrl(imageFileUri)
            .then(fileEntry => {
                console.log('Normalized imageFileUri: ' + normalizeURL(imageFileUri));
                console.log('Normalized fileEntry.nativeURL: ' + normalizeURL(fileEntry.nativeURL));
                console.log('Normalized fileEntry.toInternalURL(): ' + normalizeURL(fileEntry.toInternalURL()))
                //this.feed.imagem = normalizeURL(fileEntry.toInternalURL())
                let nativeUri = normalizeURL(fileEntry.nativeURL);
                if (nativeUri.indexOf('file://') !== -1) {
                    nativeUri = nativeUri.replace('file://', '');
                }
                // if (nativeUri.indexOf('content://') !== -1) {
                //     nativeUri = nativeUri.replace('content://', '');
                // }
                this.feed.imagem = normalizeURL(nativeUri);
                //this.feedImage = this.sanitizer.bypassSecurityTrustUrl(this.feed.imagem);
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

}
