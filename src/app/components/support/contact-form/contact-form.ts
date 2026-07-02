import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  isSubmitted = false;

  constructor(private http: HttpClient) {}

  supportTopics = [
    "Order Issue (Technical Problem)",
    "Incorrect / Wrong Item Received",
    "Delivery Delay / Tracking Issue",
    "Refund Request",
    "Return Request",
    "Hair Care Advice / Product Support",
    "Payment Issue",
    "Other / Specify Your Issue"
  ];

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    topic: '',
    otherSpecify: '',
    message: ''
  };

  showOtherField = false;

  onTopicChange(event: any) {
    this.showOtherField = event.target.value === 'Other / Specify Your Issue';
    if (!this.showOtherField) {
      this.formData.otherSpecify = '';
    }
  }

  onSubmit() {
    // REPLACE THIS URL WITH YOUR ACTUAL FORMSPREE ENDPOINT
    const formspreeEndpoint = 'https://formspree.io/f/mqevareb';
    
    this.http.post(formspreeEndpoint, this.formData).subscribe({
      next: () => {
        this.isSubmitted = true;
      },
      error: (err) => {
        console.error('Submission failed', err);
        alert('Something went wrong. Please try again.');
      }
    });
  }
}