import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from 'core/model/user';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {AdminService} from 'feature/admin/admin.service';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'tlims-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  contacts: Array<User> = [];
  @BlockUI('contactsList') blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();

  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
    this.getAllContacts();
  }

  getAllContacts() {
    this.blockUI.start('Loading contacts...');
    this.adminService.findAllContacts(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.contacts = res['content'];
      }
      this.blockUI.stop();
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
