import {Component, Input, OnInit} from '@angular/core';
import {Ad} from 'feature/items/ad';
import {ENV} from 'core/config/env.config';

@Component({
  selector: 'tlims-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  @Input()
  ad: Ad;
  routerLink = '/tlims/ad/';
  baseUrl = `${ENV.STORAGE_API}`;

  constructor() { }

  ngOnInit() {
  }

}