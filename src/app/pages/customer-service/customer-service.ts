import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceItems } from '../../components/customer-service/customer-service-items/customer-service-items';
import { CustomerServiceInfo } from '../../components/customer-service/customer-service-info/customer-service-info';

@Component({
  selector: 'app-customer-service',
  standalone: true,
  imports: [CommonModule, CustomerServiceItems, CustomerServiceInfo],
  templateUrl: './customer-service.html',
  styleUrl: './customer-service.css',
})
export class CustomerService {
  // Completely stripped back. 
  // Let Angular and CSS scroll-margin-top handle the routing and offsets natively.
}