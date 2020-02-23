import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ToastrService} from 'ngx-toastr';
import {User} from 'core/model/user';
import {AdminService} from 'feature/admin/admin.service';
import {MsgService} from 'core/services/msg.service';
import {NgxCoolDialogsService} from 'ngx-cool-dialogs';

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

  constructor(private adminService: AdminService, private msgService: MsgService,
              private coolDialogs: NgxCoolDialogsService) {
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
      this.msgService.error(err);
      this.blockUI.stop();
    });
  }

  confirm(d) {
    this.coolDialogs.confirm('Are you sure?').pipe(untilDestroyed(this)).subscribe((res) => {
      if (res) {
        this.activateOrDeactivate(d);
      }
    });
  }

  activateOrDeactivate(user: User) {
    this.blockUI.start('Please wait...');
    this.adminService.activateOrDeactivateUser(user).pipe(untilDestroyed(this)).subscribe((res) => {
      if ('OK' === res) {
        const msg = !user.status ? 'User Successfully Activated' : 'User Successfully Deactivated';
        this.msgService.success(msg);
      }
      this.blockUI.stop();
      this.getAllUsers();
    }, (err) => {
      this.msgService.error(err);
      this.blockUI.stop();
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  ngOnDestroy(): void {
  }

}
