import {Component, Input, OnInit} from '@angular/core';
import {Ad} from 'feature/items/ad';
import {ENV} from 'core/config/env.config';
import {MessageService} from 'core/services/message.service';
import {ToastrService} from 'ngx-toastr';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {APP_URL} from 'core/constant/tlims.url';

@Component({
  selector: 'tlims-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  @Input()
  ad: Ad;
  APP_URL = APP_URL;
  baseUrl = `${ENV.STORAGE_API}`;
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
