import {Component, OnDestroy, OnInit} from '@angular/core';
import {Category} from 'core/model/category';
import {ActivatedRoute} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tlims-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit, OnDestroy {

  categories: Array<Category> = [];

  slidess = [
    {img: '../../assets/images/wallpaper/3.jpg'},
    {img: '../../assets/images/wallpaper/4.jpg'},
    {img: '../../assets/images/wallpaper/5.jpg'},
    {img: '../../assets/images/wallpaper/7.jpg'},
    {img: '../../assets/images/wallpaper/10.jpg'},
  ];

  images = [
    {
      text: 'Everfresh Flowers',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/1.jpg'
    },
    {
      text: 'Festive Deer',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/2.jpg'
    },
    {
      text: 'Morning Greens',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/3.jpg'
    },
    {
      text: 'Bunch of Love',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/4.jpg'
    },
    {
      text: 'Blue Clear',
      image: 'https://freakyjolly.com/demo/jquery/PreloadJS/images/5.jpg'
    }
  ];


  slideConfig = {
    'slidesToShow': 1,
    'slidesToScroll': 1,
    'autoplay': true,
    'autoplaySpeed': 4000,
    'infinite': true
  };

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.activatedRoute.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.categories = data.categories;
    });
  }

  ngOnDestroy(): void {
  }

}
