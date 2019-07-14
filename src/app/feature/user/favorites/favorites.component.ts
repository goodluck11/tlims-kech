import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {UserService} from '../user.service';
import {ToastrService} from 'ngx-toastr';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'tlims-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  ads: Array<any> = [];
  @BlockUI('ad-list') blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();


  constructor(private userService: UserService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllUserAds();
  }

  getAllUserAds() {
    this.blockUI.start('Loading favorites...');
    this.userService.findFavoriteAds(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.ads = res['content'];
      }
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Error loading favorites');
      this.blockUI.stop();
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
