import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from 'core/model/category';
import {ActivatedRoute} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tlims-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit, OnDestroy {

  categories: Array<Category> = [];

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.categories = data.categories;
    });
  }

  ngOnDestroy(): void {
  }

}
