import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tlims-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  @Input()
  isLoading = false;

  constructor() { }

  ngOnInit() {
  }

}
