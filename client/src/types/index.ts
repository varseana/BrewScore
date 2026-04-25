// ⁘[ TIPOS COMPARTIDOS ]⁘

export type UserRole = "EXPLORER" | "CONNOISSEUR" | "OWNER" | "ADMIN";
export type EstablishmentStatus = "ACTIVE" | "FLAGGED" | "SUSPENDED" | "REMOVED";
export type ReportReason = "MISLEADING_INFO" | "FALSE_PROCEDURES" | "FAKE_EQUIPMENT" | "OTHER";
export type ReportStatus = "PENDING" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";
export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  tastePreferences: string[];
  role: UserRole;
  followerCount: number;
  followingCount: number;
  reviewCount: number;
  createdAt: string;
  isFollowing?: boolean;
}

export interface Establishment {
  id: string;
  ownerId: string | null;
  name: string;
  description: string | null;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  photos: string[];
  hours: Record<string, string> | null;
  transparencyScore: number;
  avgRating: number;
  reviewCount: number;
  verified: boolean;
  status: EstablishmentStatus;
  createdAt: string;
  coffeeProgram?: CoffeeProgram | null;
  owner?: { id: string; name: string; avatar: string | null } | null;
  _count?: { reviews: number; favorites: number; strikes: number };
  isFavorited?: boolean;
}

export interface CoffeeProgram {
  id: string;
  establishmentId: string;
  beanOrigins: string[];
  brewingMethods: string[];
  equipment: { name: string; type: string }[];
  waterFiltration: string | null;
  milkOptions: string[];
  signatureDrinks: { name: string; description: string }[];
  roastPolicy: string | null;
  roastsInHouse: boolean;
  daysFromRoast: number | null;
}

export interface Review {
  id: string;
  userId: string;
  establishmentId: string;
  ratingBean: number;
  ratingPrep: number;
  ratingEquipment: number;
  ratingConsist: number;
  ratingOverall: number;
  text: string | null;
  photos: string[];
  drinkOrdered: string | null;
  ownerReply: string | null;
  ownerReplyAt: string | null;
  createdAt: string;
  user?: { id: string; name: string; avatar: string | null; role: UserRole };
  establishment?: { id: string; name: string; city: string; avgRating: number };
}

export interface Report {
  id: string;
  reporterId: string;
  establishmentId: string;
  reason: ReportReason;
  description: string;
  evidence: string[];
  status: ReportStatus;
  adminNotes: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  total?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}
