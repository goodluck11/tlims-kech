import {Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AuthenticationService} from 'core/services/auth.service';
import {CoreService} from 'core/services/core.service';
import {ToastrService} from 'ngx-toastr';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Directive({
  selector: '[tlimsFavorite]'
})
export class FavoriteDirective implements OnInit, OnDestroy {

  @Input()
  tlimsFavorite: any;
  checked = '<i class="fa fa-heart"></i>';
  unChecked = '<i class="fa fa fa-heart-o"></i>';

  constructor(private authService: AuthenticationService, private coreService: CoreService, private toastr: ToastrService,
              private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.el.nativeElement.innerHTML = this.unChecked;
    if (this.authService.isLoggedIn() && this.tlimsFavorite.id) {
      this.coreService.favoriteAdded(this.tlimsFavorite.id).pipe(untilDestroyed(this)).subscribe((res) => {
        if (res) {
          this.el.nativeElement.innerHTML = this.unChecked;
          // this.renderer.addClass(this.el.nativeElement, 'd-none');
        }
      });
    }
  }

  @HostListener('click')
  addFavorite() {
    if (this.authService.isLoggedIn() && this.tlimsFavorite.id) {
      this.coreService.addFavorite({postId: this.tlimsFavorite.id}).pipe(untilDestroyed(this)).subscribe((res) => {
        this.toastr.success('Item successfully added to favorites');
        // this.renderer.addClass(this.el.nativeElement, 'd-none');
        this.el.nativeElement.innerHTML = this.unChecked;
      });
    } else {
      this.toastr.warning('You must be logged in before you can be able to favorite this item.');
    }
  }

  ngOnDestroy(): void {
  }

}
