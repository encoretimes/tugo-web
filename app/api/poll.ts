import { apiClient } from "@/lib/api-client";
import { VoteRequest } from "../types/poll";

export async function vote(pollId: number, optionIds: number[]): Promise<void> {
  const request: VoteRequest = { optionIds };
  return apiClient.post<void>(`/api/v1/polls/${pollId}/vote`, request);
}

export async function updateVote(pollId: number, optionIds: number[]): Promise<void> {
  const request: VoteRequest = { optionIds };
  return apiClient.put<void>(`/api/v1/polls/${pollId}/vote`, request);
}

export async function deleteVote(pollId: number): Promise<void> {
  return apiClient.delete<void>(`/api/v1/polls/${pollId}/vote`);
}
