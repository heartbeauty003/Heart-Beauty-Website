import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, deleteUser } from '@angular/fire/auth';
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-management.html',
  styleUrl: './account-management.css',
})
export class AccountManagement implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isConfirming = false;
  isDeleting = false;
  deleteError: string | null = null;

  confirmationCode = '';
  userConfirmInput = '';

  private resolvedUserId: string | null = null;

  async ngOnInit(): Promise<void> {
    this.resolvedUserId = await new Promise<string | null>(resolve => {
      const unsub = this.auth.onAuthStateChanged(authUser => {
        unsub();
        resolve(authUser?.uid ?? null);
      });
    });
  }

  get confirmationMatches(): boolean {
    return this.userConfirmInput.trim() === this.confirmationCode;
  }

  promptDeletionConfirmation(): void {
    this.confirmationCode = this.generateCode();
    this.userConfirmInput = '';
    this.deleteError = null;
    this.isConfirming = true;
  }

  abortDeletion(): void {
    this.isConfirming = false;
    this.userConfirmInput = '';
    this.deleteError = null;
    this.cdr.detectChanges();
  }

  async executeAccountDeletion(): Promise<void> {
    if (!this.confirmationMatches || !this.resolvedUserId) return;

    this.isDeleting = true;
    this.deleteError = null;
    this.cdr.detectChanges();

    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) throw new Error('No authenticated user found.');

      // 1. Delete Firestore user document
      const userDocRef = doc(this.firestore, `users/${this.resolvedUserId}`);
      await deleteDoc(userDocRef);

      // 2. Delete Firebase Auth account
      await deleteUser(currentUser);

      // 3. Redirect to home after deletion
      await this.router.navigate(['/']);
    } catch (err: any) {
      console.error('[AccountManagement] Account deletion failed:', err);
      this.deleteError = 'Failed to delete account. Please try again.';
      this.isDeleting = false;
      this.cdr.detectChanges();
    }
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}