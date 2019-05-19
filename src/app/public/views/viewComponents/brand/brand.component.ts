import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'tlims-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  @Input()
  brands: Array<any> = [];
  url: string;

  constructor(private router: Router) {
    this.url = router.url.split('?')[0];
  }

  ngOnInit() {
  }

}
