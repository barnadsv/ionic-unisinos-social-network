import { Component } from '@angular/core';

import { IonicPage } from 'ionic-angular';

import { NavController } from 'ionic-angular/navigation/nav-controller';

@IonicPage()
@Component({
  selector: 'page-feeds',
  templateUrl: 'feeds.html'
})
export class FeedsPage {

    constructor(private navCtrl: NavController) {}

    onNovoFeed() {
        this.navCtrl.push('FeedEditPage');
    }
    
}