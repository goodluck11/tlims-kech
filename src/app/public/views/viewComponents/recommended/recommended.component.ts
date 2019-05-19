import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tlims-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.scss']
})
export class RecommendedComponent implements OnInit {

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

  slideConfigs = {
    'slidesToShow': 4,
    'slidesToScroll': 1,
    'infinite': true,
    'autoplay': true,
    'arrows': false
  };

  constructor() { }

  ngOnInit() {
  }

}
