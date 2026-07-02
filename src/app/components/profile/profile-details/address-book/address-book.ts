import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { UsersService } from '../../../../services/users/users.service';
import { PhysicalAddress } from '../../../../models/user/user.model';

@Component({
  selector: 'app-address-book',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-book.html',
  styleUrl: './address-book.css',
})
export class AddressBook implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  addressForm!: FormGroup;
  isEditing = false;
  isAdding = false;
  isLoading = true;
  isSaving = false;

  currentAddress: PhysicalAddress | null = null;
  private resolvedUserId: string | null = null;

  ngOnInit(): void {
    this.loadAddress();
  }

  async loadAddress(): Promise<void> {
    this.isLoading = true;
    this.cdr.detectChanges();

    // Wait for Firebase Auth to fully resolve
    this.resolvedUserId = await new Promise<string | null>(resolve => {
      const unsubscribe = this.auth.onAuthStateChanged(authUser => {
        unsubscribe();
        resolve(authUser?.uid ?? null);
      });
    });

    if (!this.resolvedUserId) {
      console.warn('[AddressBook] No authenticated user found.');
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      const profile = await this.usersService.getUserProfile(this.resolvedUserId);
      this.currentAddress = profile?.physicalAddress ?? null;
    } catch (error) {
      console.error('[AddressBook] Failed to load address:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  initForm(address?: PhysicalAddress | null): void {
    this.addressForm = this.fb.group({
      street: [address?.street ?? '', Validators.required],
      suburb: [address?.suburb ?? '', Validators.required],
      city: [address?.city ?? '', Validators.required],
      province: [address?.province ?? 'Gauteng', Validators.required],
      postalCode: [address?.postalCode ?? '', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
    });
  }

  startAdding(): void {
    this.initForm(null);
    this.isAdding = true;
    this.isEditing = false;
  }

  startEditing(): void {
    this.initForm(this.currentAddress);
    this.isEditing = true;
    this.isAdding = false;
  }

  cancelForm(): void {
    this.isEditing = false;
    this.isAdding = false;
    this.cdr.detectChanges();
  }

  async saveAddress(): Promise<void> {
    if (this.addressForm.invalid || !this.resolvedUserId) return;

    this.isSaving = true;
    this.cdr.detectChanges();

    try {
      const address: PhysicalAddress = this.addressForm.value;

      await this.usersService.updateUserProfile(this.resolvedUserId, {
        physicalAddress: address
      });

      this.currentAddress = { ...address };
      this.isEditing = false;
      this.isAdding = false;
    } catch (error) {
      console.error('[AddressBook] Failed to save address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }
}