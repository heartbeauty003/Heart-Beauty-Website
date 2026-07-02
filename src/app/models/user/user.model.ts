export interface LoyaltyMemberDetails {
  firstName: string;
  lastName: string;
  emailAddress: string;
  memberNo: string;
}

export interface PhysicalAddress {
  street: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface HBUser {
  userId: string;
  title?: string | null;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth?: string | null;
  isLoyaltyMember: boolean;
  loyaltyMemberDetails: LoyaltyMemberDetails | null;
  physicalAddress: PhysicalAddress | null;
  createdAt: string;
  updatedAt: string;
}