import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'prefix-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  public show = true;

  public type = 'component';

  public disabled = false;

  constructor() {}

  ngOnInit() {
  }

}
