import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { FeedService } from '../../../shared/services/feed.service';

import { Feed } from '../../../shared/models/feed.interface';

@Component({
    selector: 'app-feed-edit',
    templateUrl: './feed-edit.component.html'
})
export class FeedEditComponent implements OnInit {

    @Output() salvarFeedStatus: EventEmitter<{success: Boolean, message: string, error: string}>;
    id: string;
    editMode = false;
    feed = {} as Feed;
    //private feedRef: AngularFireObject<Feed>;

    constructor(private feedService: FeedService,
                private navCtrl: NavController,
                private navParams: NavParams) { 

            this.salvarFeedStatus = new EventEmitter<{success: Boolean, message: string, error: string}>();

            // this.feedRef = this.db.object('feeds/' + this.id);
            // this.feedRef.valueChanges().subscribe(feed => {
            //     this.feed = feed;
            // });

            this.feedService.salvarFeedMessage.subscribe(
                (resposta) => {
                this.salvarFeedStatus.emit(resposta);
                }
            );

    }

    ngOnInit() {
        this.feed = this.navParams.get('feed');
        if (this.feed !== null) {
            this.editMode = true;
            this.id = this.feed.id;
        } else {
            this.editMode = false;
            this.id = '';
        }

        // const idParam = this.navParams.get('id');
        // typeof idParam !== 'undefined'? this.id = idParam : this.id = null;
        // if (this.id !== null) {
        //     //this.feed = this.feedService.getFeed(this.id);
        //     this.editMode = true;
        // } else {
        //     this.editMode = false;
        // }
        
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

}
