import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, runTransaction } from '@angular/fire/firestore';
import { HBUser, LoyaltyMemberDetails } from '../../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private firestore = inject(Firestore);

  async createUserProfile(
    userId: string,
    firstName: string,
    lastName: string,
    emailAddress: string
  ): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);

    const newUser: HBUser = {
      userId,
      firstName,
      lastName,
      emailAddress,
      isLoyaltyMember: false,
      loyaltyMemberDetails: null,
      physicalAddress: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userRef, newUser);
    console.log('[UsersService] User profile created:', userId);
  }

  async getUserProfile(userId: string): Promise<HBUser | null> {
    const userRef = doc(this.firestore, `users/${userId}`);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data() as HBUser;
  }

  async updateUserProfile(userId: string, updates: Partial<HBUser>): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    console.log('[UsersService] User profile updated:', userId);
  }

  async registerLoyaltyMember(
    userId: string,
    details: Omit<LoyaltyMemberDetails, 'memberNo'>
  ): Promise<void> {
    const memberNo = await this.generateMemberNo();

    const loyaltyMemberDetails: LoyaltyMemberDetails = {
      ...details,
      memberNo,
    };

    await this.updateUserProfile(userId, {
      isLoyaltyMember: true,
      loyaltyMemberDetails,
      firstName: details.firstName,
      lastName: details.lastName,
    });

    console.log('[UsersService] Loyalty member registered:', userId, memberNo);
  }

  private async generateMemberNo(): Promise<string> {
    const counterRef = doc(this.firestore, 'system/loyaltyCounter');
    const yearCode = new Date().getFullYear().toString().slice(-3);

    const nextSequence = await runTransaction(this.firestore, async (transaction) => {
      const snap = await transaction.get(counterRef);

      const current = snap.exists()
        ? (snap.data()['currentSequenceNumber'] as number)
        : 1000;

      const next = current + 1;

      transaction.update(counterRef, { currentSequenceNumber: next });

      return next;
    });

    return `HB-${nextSequence}-${yearCode}`;
  }
}