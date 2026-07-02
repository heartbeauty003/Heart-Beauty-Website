import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { UsersService } from '../../../../services/users/users.service';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-details.html',
  styleUrl: './account-details.css',
})
export class AccountDetails implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  detailsForm!: FormGroup;
  isLoading = true;
  savingField: string | null = null;
  saveError: string | null = null;

  editStates: { [key: string]: boolean } = {
    title: false,
    firstName: false,
    lastName: false,
    dob: false,
  };

  private formBackup: any = {};
  private resolvedUserId: string | null = null;

  async ngOnInit(): Promise<void> {
    this.detailsForm = this.fb.group({
      title: [null],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dob: [null],
    });

    // Wait for Firebase Auth to fully resolve the current user
    this.resolvedUserId = await new Promise<string | null>(resolve => {
      const unsub = this.auth.onAuthStateChanged(authUser => {
        unsub();
        resolve(authUser?.uid ?? null);
      });
    });

    await this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    this.isLoading = true;
    this.cdr.detectChanges();

    try {
      if (!this.resolvedUserId) {
        console.warn('[AccountDetails] No authenticated user found.');
        return;
      }

      const profile = await this.usersService.getUserProfile(this.resolvedUserId);

      if (profile) {
        this.detailsForm.patchValue({
          title: profile.title || null,
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          dob: (profile as any).dateOfBirth || null,
        });
        this.backupValues();
      }
    } catch (err) {
      console.error('[AccountDetails] Failed to load profile:', err);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  toggleEdit(field: string): void {
    this.editStates[field] = true;
    this.saveError = null;
  }

  async saveField(field: string): Promise<void> {
    const control = this.detailsForm.get(field);
    if (!this.resolvedUserId) return;

    this.savingField = field;
    this.saveError = null;
    this.cdr.detectChanges();

    const firestoreKey = field === 'dob' ? 'dateOfBirth' : field;

    try {
      await this.usersService.updateUserProfile(this.resolvedUserId, {
        [firestoreKey]: control?.value ?? null,
      });
      this.editStates[field] = false;
      this.backupValues();
    } catch (err) {
      console.error(`[AccountDetails] Failed to save ${field}:`, err);
      this.saveError = 'Failed to save. Please try again.';
    } finally {
      this.savingField = null;
      this.cdr.detectChanges();
    }
  }

  cancelEdit(field: string): void {
    this.editStates[field] = false;
    this.detailsForm.get(field)?.setValue(this.formBackup[field]);
    this.saveError = null;
    this.cdr.detectChanges();
  }

  isSaving(field: string): boolean {
    return this.savingField === field;
  }

  private backupValues(): void {
    this.formBackup = { ...this.detailsForm.value };
  }
}