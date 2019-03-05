import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tlims-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  @Input()
  justify: string;

  constructor() { }

  ngOnInit() {
  }

}
