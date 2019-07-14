import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'tlims-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input()
  visible = false;
  @Output()
  close = new EventEmitter();
  @Input()
  position: string;
  @Input()
  size: string;
  @Input()
  minHeight: string;
  @Input()
  minWidth: string;
  @Input()
  dismissAble = false;

  /*@Input()
  visible = false;
  @Output()
  close = new EventEmitter();*/
  @Input()
  direction = 'top';

  closeModal() {
    this.visible = false;
    this.close.emit(this.visible);
  }

  constructor() { }

  ngOnInit() {  }

  onDismiss() {
    if (this.dismissAble) {
      this.visible = !this.visible;
      this.close.emit(this.visible);
    }
  }

  dismiss() {
    if (this.dismissAble) {
      this.visible = false;
      this.close.emit(this.visible);
    }
  }

}
