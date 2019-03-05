import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'tlims-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
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
    ])
  ]
})
export class AccordionComponent implements OnInit {

  @Input()
  isCollapsed = false;
  @Input()
  isUpperCase: boolean;
  @Input()
  title: string;
  @Input()
  noRadiusBorder = false;
  @Input()
  styleClass: string;
  @Input()
  bodyClass: string;
  @Output()
  callback = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  toggleIcon() {
    this.isCollapsed = !this.isCollapsed;
    this.callback.emit();
  }
}
