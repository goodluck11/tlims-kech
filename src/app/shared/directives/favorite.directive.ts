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
  isFavorite = false;

  constructor(private authService: AuthenticationService, private coreService: CoreService, private toastr: ToastrService,
              private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.el.nativeElement.innerHTML = this.unChecked;
    if (this.authService.isLoggedIn() && this.tlimsFavorite.id) {
      this.renderer.addClass(this.el.nativeElement, 'd-none');
      this.coreService.favoriteAdded(this.tlimsFavorite.id).pipe(untilDestroyed(this)).subscribe((res: any) => {
        this.isFavorite = res;
        this.renderer.addClass(this.el.nativeElement, 'd-block');
        if (res) {
          this.el.nativeElement.innerHTML = this.checked;
          this.renderer.addClass(this.el.nativeElement, 'bg-warning');
        }
      });
    }
  }

  @HostListener('click')
  addOrRemoveFavorite() {
    if (this.authService.isLoggedIn() && this.tlimsFavorite.id) {
      if (!this.isFavorite) {
        this.addToFavorites();
        return;
      }
      this.removeFavorites();
    } else {
      this.toastr.warning('You must be logged in before you can be able to add item to favorites');
    }
  }

  addToFavorites() {
    this.coreService.addFavorite({postId: this.tlimsFavorite.id}).pipe(untilDestroyed(this)).subscribe((res) => {
      this.toastr.success('Item successfully added to favorites');
      this.el.nativeElement.innerHTML = this.checked;
      this.renderer.addClass(this.el.nativeElement, 'bg-warning');
      this.isFavorite = true;
    });
  }

  removeFavorites() {
    this.coreService.removeFavorite(this.tlimsFavorite.id).pipe(untilDestroyed(this)).subscribe((res) => {
      this.toastr.success('Item successfully removed from favorites');
      this.el.nativeElement.innerHTML = this.unChecked;
      this.renderer.removeClass(this.el.nativeElement, 'bg-warning');
      this.isFavorite = false;
    });
  }

  ngOnDestroy(): void {
  }

}
