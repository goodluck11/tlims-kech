import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {UserService} from '../user.service';
import {ToastrService} from 'ngx-toastr';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';
import {CoreService} from 'core/services/core.service';
import {NgxCoolDialogsService} from 'ngx-cool-dialogs';
import {Ad} from 'feature/items/ad';

@Component({
  selector: 'tlims-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  ads: Array<Ad> = [];
  @BlockUI('ad-list') blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();
  APP_URL = APP_URL;


  constructor(private userService: UserService, private toastr: ToastrService,
              private coreService: CoreService, private coolDialogs: NgxCoolDialogsService) {
  }

  ngOnInit() {
    this.getAllUserAds();
  }

  getAllUserAds() {
    this.blockUI.start('Loading favorites...');
    this.userService.findFavoriteAds(new SearchRequest(this.searchTerm, this.query))
      .pipe(untilDestroyed(this)).subscribe((res) => {
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

  confirmRemove(postId) {
    this.coolDialogs.confirm('Are you sure you want to remove this item?').pipe(untilDestroyed(this))
      .subscribe(res => {
        if (res) {
          this.removeFav(postId);
        }
      });
  }

  removeFav(postId) {
    this.blockUI.start('Removing favorites...');
    this.coreService.removeFavorite(postId).pipe(untilDestroyed(this)).subscribe((res) => {
      if (res) {
        this.toastr.success('Favorite removed successfully');
        this.getAllUserAds();
      }
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Error removing favorites');
      this.blockUI.stop();
    });
  }

  ngOnDestroy(): void {
  }

}
