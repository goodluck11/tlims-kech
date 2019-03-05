import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tlims-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.scss']
})
export class CategoryViewComponent implements OnInit {

  @Input()
  category: string;
  @Input()
  subCategory: string;

  constructor() { }

  ngOnInit() {
  }

}
