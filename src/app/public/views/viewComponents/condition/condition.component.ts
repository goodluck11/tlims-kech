import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'tlims-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit {

  url: string;

  constructor(private router: Router) {
    this.url = router.url.split('?')[0];
  }

  ngOnInit() {
  }

}
