import { Component } from '@angular/core';
import { AboutCompany } from '../../components/about-us/about-company/about-company';
import { AboutDirector } from '../../components/about-us/about-director/about-director';
import { Gallery } from '../../components/about-us/gallery/gallery';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    AboutCompany,
    AboutDirector,
    Gallery
  ],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {}