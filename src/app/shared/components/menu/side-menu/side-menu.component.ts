import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'tlims-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  animations: [
    trigger('collapseInOut', [
      state('in', style({
        // transform: 'translate3d(0, 0, 0)',
        'display': 'block'
      })),
      state('out', style({
        // transform: 'translate3d(100%, 0, 0)',
        'display': 'none'
      })),
      transition('in => out', animate('.3s ease-in-out')),
      transition('out => in', animate('.3s ease-in-out'))
    ]),
    trigger('rotateLinkIcon', [
      state('up', style({
        transform: 'rotate(0deg)'
      })),
      state('down', style({
        transform: 'rotate(90deg)'
      })),
      transition('up => down', animate('.4s ease-in-out')),
      transition('down => up', animate('.4s ease-in-out'))
    ])
  ]
})
export class SideMenuComponent implements OnInit {

  isCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

  toggleIcon() {
    this.isCollapsed = !this.isCollapsed;
    // this.callback.emit();
  }

}
