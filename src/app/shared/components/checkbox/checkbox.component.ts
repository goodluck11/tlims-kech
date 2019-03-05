import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tlims-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  @Input()
  label: string;
  @Input()
  styleClass: string;

  constructor() {
  }

  ngOnInit() {
  }

}
