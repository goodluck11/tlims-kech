import {Component, Input, OnInit} from '@angular/core';
import {Ad} from 'feature/items/ad';
import {ENV} from 'core/config/env.config';

@Component({
  selector: 'tlims-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input()
  ad: Ad;
  baseUrl = `${ENV.STORAGE_API}`;
  routerLink = '/tlims/ad/';

  constructor() { }

  ngOnInit() {
  }

}
