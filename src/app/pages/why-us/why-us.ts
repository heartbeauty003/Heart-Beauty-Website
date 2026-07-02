import { Component } from '@angular/core';
import { Banner } from '../../components/why-us/banner/banner';
import { WhyUsInfo } from '../../components/why-us/why-us-info/why-us-info';

@Component({
  selector: 'app-why-us',
  standalone: true,
  imports: [Banner, WhyUsInfo],
  templateUrl: './why-us.html',
  styleUrl: './why-us.css',
})
export class WhyUs {}