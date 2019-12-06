import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthenticationService} from 'core/services/auth.service';
import {Contact} from 'core/model/base-model';

@Component({
  selector: 'tlims-contact-form',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  userDetails: any;
  @Output()
  contactDetails = new EventEmitter<Contact>();
  contact: Contact = new Contact();

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.userDetails = this.authService.getCurrentUser();
    this.contact = Contact.of((this.userDetails.displayName || `${this.userDetails.lastName} ${this.userDetails.firstName}`),
      this.userDetails.phoneNumber, this.userDetails.email);
    this.contactDetails.emit(this.contact);
  }

  updateNumber(phone) {
    this.contact.phoneNumber = phone;
    this.contactDetails.emit(this.contact);
  }

}
