import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CoreService} from 'core/services/core.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ToastrService} from 'ngx-toastr';
import {MsgService} from 'core/services/msg.service';

@Component({
  selector: 'tlims-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  formControl: FormControl;
  isLoading = false;

  constructor(private coreService: CoreService, private toastr: MsgService) {
    this.formControl = new FormControl();
    this.formControl.setValidators([Validators.required]);
  }

  ngOnInit() {
  }

  subscribe() {
    this.isLoading = true;
    this.coreService.subscribeEmail(this.formControl.value).pipe(untilDestroyed(this)).subscribe((res) => {
      if (res) {
        this.formControl.reset();
        this.toastr.success('You have successfully subscribed to our newsletter');
      }
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      this.toastr.error(err);
    });
  }

  ngOnDestroy(): void {
  }
}
