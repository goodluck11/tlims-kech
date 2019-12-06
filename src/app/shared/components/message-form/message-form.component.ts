import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Message, MessageSource} from 'core/model/message';
import {AuthenticationService} from 'core/services/auth.service';
import {User} from 'core/model/user';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'tlims-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit, OnChanges {

  mForm: FormGroup;
  message: Message = new Message();
  @Output()
  messageOutput = new EventEmitter<Message>();
  @Input()
  isLoading = false;
  @Input()
  title = true;
  @Input()
  recipient: string;
  @Input()
  postId: number;
  disableBtn = false;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.setDefaults();
    this.initForm();
  }

  submit() {
    this.message = this.mForm.value;
    this.messageOutput.emit(this.message);
  }

  validate() {
    this.disableBtn = false;
    const email = this.mForm.get('contact').get('email').value;
    if (email) {
      if (this.recipient === email) {
        this.toastr.warning('Email cannot be sent to self');
        this.disableBtn = true;
      }
    }
  }

  setDefaults() {
    if (this.authService.isLoggedIn()) {
      const user: User = this.authService.getCurrentUser();
      this.message.contact.name = user.displayName;
      this.message.contact.email = user.email;
      this.message.contact.phoneNumber = user.phoneNumber;
    } else {
      this.message.source = MessageSource.EXTERNAL;
    }
    this.message.recipient = this.recipient;
    this.message.postId = this.postId;
  }

  reset() {
    this.message = new Message();
    this.setDefaults();
    this.initForm();
  }

  private initForm() {
    this.mForm = this.fb.group({
      contact: this.fb.group({
        name: [this.message.contact.name],
        phoneNumber: [this.message.contact.phoneNumber],
        email: [this.message.contact.email]
      }),
      content: [this.message.content],
      postId: [this.message.postId],
      recipient: [this.recipient]
    });
    this.validate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isLoading) {
      if (!changes.isLoading.currentValue) {
        this.reset();
      }
    }
  }
}
