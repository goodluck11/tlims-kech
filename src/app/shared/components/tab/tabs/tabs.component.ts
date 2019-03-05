import {AfterContentInit, Component, ContentChildren, OnInit, QueryList} from '@angular/core';
import {TabComponent} from '../tab/tab.component';

@Component({
  selector: 'tlims-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    if (this.tabs) {
      this.selectTab(this.tabs.first);
    }
    // console.log(this.tabs);
  }

  selectTab(tab: TabComponent) {
    this.tabs.forEach( t => t.isActive = false);
    tab.isActive = true;
  }
}
