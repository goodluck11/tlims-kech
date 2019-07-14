import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ToastrService} from 'ngx-toastr';
import {User} from 'core/model/user';
import {AdminService} from 'feature/admin/admin.service';

@Component({
  selector: 'tlims-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  users: Array<User> = [];
  @BlockUI('usersList') blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();

  constructor(private adminService: AdminService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.blockUI.start('Loading users...');
    this.adminService.findAll(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        this.users = res['content'];
      }
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Error loading users');
      this.blockUI.stop();
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
