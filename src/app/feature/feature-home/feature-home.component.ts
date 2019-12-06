import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tlims-feature-home',
  templateUrl: './feature-home.component.html',
  styleUrls: ['./feature-home.component.scss']
})
export class FeatureHomeComponent implements OnInit {

  sideBarVisible = false;

  constructor() { }

  ngOnInit() {
  }

  toggle($event) {
    this.sideBarVisible = $event;
  }

}
