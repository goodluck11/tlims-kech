import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'tlims-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent {

  @Input()
  label: string;
}
