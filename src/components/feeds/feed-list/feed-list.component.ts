import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Feed } from '../../../shared/models/feed.interface';
import { FeedService } from '../../../shared/services/feed.service';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html'
})
export class FeedListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  feeds: Feed[];

  constructor(private feedService: FeedService,
              private navCtrl: NavController) { }

  ngOnInit() {
      this.feeds = this.feedService.getFeeds();
      this.feeds = this.sortFeeds(this.feeds);
      this.subscription = this.feedService.feedsAlterados.subscribe(
          (feeds: Feed[]) => {
              this.feeds = feeds;
              this.feeds = this.sortFeeds(this.feeds);
          }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onNovoFeed() {
    this.navCtrl.push('FeedEditPage');
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

}
