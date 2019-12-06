import {Directive, ElementRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthenticationService} from 'core/services/auth.service';

@Directive({
  selector: '[tlimsIsLogedin]'
})
export class IsLogedinDirective {

  @Input()
  set tlimsIsLogedin(val) {
    if (!this.authService.isLoggedIn()) {
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
