import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { FirebaseApp } from 'angularfire2';

import { FeedService } from '../../../shared/services/feed.service';

import { Feed } from '../../../shared/models/feed.interface';

@Component({
    selector: 'app-feed-edit',
    templateUrl: './feed-edit.component.html',
    providers: [Camera, PhotoLibrary]
})
export class FeedEditComponent implements OnInit {

    @Output() salvarFeedStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
    id: string;
    editMode = false;
    feed = {} as Feed;

    options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        // targetWidth: 1000,
        // targetHeight: 1000,
        // correctOrientation: true
    } 
    
    constructor(private feedService: FeedService,
                private navCtrl: NavController,
                private navParams: NavParams,
                private camera: Camera,
                private photoLibrary: PhotoLibrary,
                @Inject(FirebaseApp) firebaseApp: any) { 

            this.salvarFeedStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();

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

        this.photoLibrary.requestAuthorization().then(() => {
            this.photoLibrary.getLibrary().subscribe({
              next: library => {
                library.forEach(function(libraryItem) {
                  console.log(libraryItem.id);          // ID of the photo
                  console.log(libraryItem.photoURL);    // Cross-platform access to photo
                  console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
                  console.log(libraryItem.fileName);
                  console.log(libraryItem.width);
                  console.log(libraryItem.height);
                  console.log(libraryItem.creationDate);
                  console.log(libraryItem.latitude);
                  console.log(libraryItem.longitude);
                  console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
                });
              },
              error: err => { console.log('could not get photos'); },
              complete: () => { console.log('done getting photos'); }
            });
          })
          .catch(err => console.log('permissions weren\'t granted'));

    }

    openCamera (): void {
        console.log('open camera');

        this.camera.getPicture(this.options)
            //.then(file_uri => this.imageSrc = file_uri
            .then((imageData) => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64:
                let base64Image = 'data:image/jpeg;base64,' + imageData;
                this.feed.imagem = base64Image;
                //console.log(base64Image);
            }, (err) => {
                console.log(err)
            });
    }

}
