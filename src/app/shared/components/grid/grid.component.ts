import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Ad} from 'feature/items/ad';
import {ENV} from 'core/config/env.config';
import {AuthenticationService} from 'core/services/auth.service';

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
  isLoggedIn = false;
  @Output()
  favorite = new EventEmitter();

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  addToFav() {
    this.favorite.emit();
  }

}
