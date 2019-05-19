import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'tlims-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.scss']
})
export class ToolBoxComponent implements OnInit {

  url: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.url = this.router.url.split('?')[0];
  }

  getLimit($event) {
    this.router.navigate([this.url], {queryParams: {limit: $event}, queryParamsHandling: 'merge'});
  }

}
