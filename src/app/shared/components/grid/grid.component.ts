import {Component, Input, OnInit} from '@angular/core';
import {Ad} from 'feature/items/ad';
import {ENV} from 'core/config/env.config';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {MessageService} from 'core/services/message.service';
import {ToastrService} from 'ngx-toastr';
import {APP_URL} from 'core/constant/tlims.url';

@Component({
  selector: 'tlims-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input()
  ad: Ad;
  baseUrl = `${ENV.STORAGE_API}`;
  APP_URL = APP_URL;
  isLoading = false;
  isOpenModal = false;

  constructor(private messageService: MessageService,
              private toastr: ToastrService) { }

  ngOnInit() {

  }

  sendMessage($event) {
    this.isLoading = true;
    this.messageService.addMesssage($event).pipe(untilDestroyed(this)).subscribe((res: any) => {
      if (res.id) {
        this.toastr.success('Message successfully sent');
      }
      this.isLoading = false;
    });
  }

}
