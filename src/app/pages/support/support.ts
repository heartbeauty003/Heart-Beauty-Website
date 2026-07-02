import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInfo } from '../../components/support/contact-info/contact-info';
import { ContactForm } from '../../components/support/contact-form/contact-form';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, ContactInfo, ContactForm],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support {
}