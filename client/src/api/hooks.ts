// ⁘[ QUERY HOOKS ]⁘
// tanstack query hooks para cada endpoint

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "./client";
import type {
  User, Establishment, Review, AuthResponse,
  PaginatedResponse, CoffeeProgram,
} from "@/types";

// ⁘[ AUTH ]⁘

export function useLogin() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthResponse>("/auth/login", data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { email: string; password: string; name: string }) =>
      api.post<AuthResponse>("/auth/register", data),
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/auth/me"),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

// ⁘[ USERS ]⁘

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get<User & { isFollowing: boolean }>(`/users/${id}`),
    enabled: !!id,
  });
}

export function useToggleFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      api.post<{ following: boolean }>(`/users/${userId}/follow`),
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
}

export function useUserReviews(userId: string) {
  return useInfiniteQuery({
    queryKey: ["user-reviews", userId],
    queryFn: ({ pageParam }) =>
      api.get<PaginatedResponse<Review>>(
        `/reviews/user/${userId}${pageParam ? `?cursor=${pageParam}` : ""}`
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    enabled: !!userId,
  });
}

// ⁘[ ESTABLISHMENTS ]⁘

interface EstablishmentFilters {
  bounds?: string;
  q?: string;
  methods?: string;
  minRating?: number;
  minScore?: number;
  roastsInHouse?: boolean;
  sort?: string;
  limit?: number;
}

export function useEstablishments(filters: EstablishmentFilters) {
  const params = new URLSearchParams();
  if (filters.bounds) params.set("bounds", filters.bounds);
  if (filters.q) params.set("q", filters.q);
  if (filters.methods) params.set("methods", filters.methods);
  if (filters.minRating) params.set("minRating", String(filters.minRating));
  if (filters.minScore) params.set("minScore", String(filters.minScore));
  if (filters.roastsInHouse) params.set("roastsInHouse", "true");
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.limit) params.set("limit", String(filters.limit));

  const qs = params.toString();
  return useQuery({
    queryKey: ["establishments", filters],
    queryFn: () =>
      api.get<PaginatedResponse<Establishment>>(`/establishments${qs ? `?${qs}` : ""}`),
    staleTime: 30 * 1000,
  });
}

export function useEstablishment(id: string) {
  return useQuery({
    queryKey: ["establishment", id],
    queryFn: () => api.get<Establishment & { isFavorited: boolean }>(`/establishments/${id}`),
    enabled: !!id,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (estId: string) =>
      api.post<{ favorited: boolean }>(`/establishments/${estId}/favorite`),
    onSuccess: (_, estId) => {
      qc.invalidateQueries({ queryKey: ["establishment", estId] });
    },
  });
}

export function useUpdateCoffeeProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ estId, data }: { estId: string; data: Partial<CoffeeProgram> }) =>
      api.put<CoffeeProgram>(`/establishments/${estId}/coffee-program`, data),
    onSuccess: (_, { estId }) => {
      qc.invalidateQueries({ queryKey: ["establishment", estId] });
    },
  });
}

// ⁘[ REVIEWS ]⁘

export function useEstablishmentReviews(estId: string) {
  return useInfiniteQuery({
    queryKey: ["reviews", estId],
    queryFn: ({ pageParam }) =>
      api.get<PaginatedResponse<Review>>(
        `/reviews/establishment/${estId}${pageParam ? `?cursor=${pageParam}` : ""}`
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    enabled: !!estId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      establishmentId: string;
      ratingBean: number; ratingPrep: number; ratingEquipment: number;
      ratingConsist: number; ratingOverall: number;
      text?: string; drinkOrdered?: string;
    }) => api.post<Review>("/reviews", data),
    onSuccess: (review) => {
      qc.invalidateQueries({ queryKey: ["reviews", review.establishmentId] });
      qc.invalidateQueries({ queryKey: ["establishment", review.establishmentId] });
    },
  });
}

// ⁘[ FEED ]⁘

export function useGlobalFeed() {
  return useInfiniteQuery({
    queryKey: ["feed-global"],
    queryFn: ({ pageParam }) =>
      api.get<PaginatedResponse<Review>>(
        `/feed/global${pageParam ? `?cursor=${pageParam}` : ""}`
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });
}

export function useFollowingFeed() {
  return useInfiniteQuery({
    queryKey: ["feed-following"],
    queryFn: ({ pageParam }) =>
      api.get<PaginatedResponse<Review>>(
        `/feed/following${pageParam ? `?cursor=${pageParam}` : ""}`
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });
}

export function useTopConnoisseurs() {
  return useQuery({
    queryKey: ["top-connoisseurs"],
    queryFn: () => api.get<User[]>("/feed/top-connoisseurs"),
    staleTime: 5 * 60 * 1000,
  });
}

// ⁘[ REPORTS ]⁘

export function useCreateReport() {
  return useMutation({
    mutationFn: (data: {
      establishmentId: string;
      reason: string;
      description: string;
      evidence?: string[];
    }) => api.post("/reports", data),
  });
}
