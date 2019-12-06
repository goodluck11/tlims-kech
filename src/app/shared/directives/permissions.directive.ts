import {Directive, ElementRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthenticationService} from 'core/services/auth.service';

@Directive({
  selector: '[allowedPermission]'
})
export class AllowedPermissionDirective {

  @Input()
  set allowedPermission(val) {
    if (this.authService.getCurrentUser().role !== val) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(private authService: AuthenticationService, private el: ElementRef,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }
}
