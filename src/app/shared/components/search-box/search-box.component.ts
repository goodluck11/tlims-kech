import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tlims-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  @Input()
  title: string;
  @Input()
  withBreadCrumb = true;
  @Input()
  withSearch = true;

  constructor() { }

  ngOnInit() {
  }

}
