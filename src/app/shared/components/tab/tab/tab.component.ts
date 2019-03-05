import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tlims-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  @Input()
  title: string;
  @Input()
  isActive: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
