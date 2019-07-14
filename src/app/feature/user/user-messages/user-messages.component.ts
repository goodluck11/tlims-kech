import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paging} from 'core/model/paging';
import {ToastrService} from 'ngx-toastr';
import {SearchRequest} from 'core/model/search-request';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {MessageService} from 'core/services/message.service';
import {Message} from 'core/model/message';
import {APP_URL} from 'core/constant/tlims.url';

@Component({
  selector: 'tlims-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.scss']
})
export class UserMessagesComponent implements OnInit, OnDestroy {

  messages: Array<Message> = [];
  @BlockUI('message-list') blockUI: NgBlockUI;
  searchTerm = '';
  query: Paging = new Paging();
  isOpenModal = false;
  message = new Message();
  APP_URL = APP_URL;


  constructor(private messageService: MessageService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllUserAds();
  }

  getAllUserAds() {
    this.blockUI.start('Loading messages...');
    this.messageService.getUserMessages(new SearchRequest(this.searchTerm, this.query)).pipe(untilDestroyed(this)).subscribe((res) => {
      if (Array(res['content'])) {
        console.log(res);
        this.messages = res['content'];
      }
      this.blockUI.stop();
    }, (err) => {
      this.toastr.error('Error loading messages');
      this.blockUI.stop();
    });
  }

  trackByFn(index, d) {
    return d.id;
  }

  viewMessage(d) {
    this.message = d;
    this.isOpenModal = true;
  }

  ngOnDestroy(): void {
  }

}
