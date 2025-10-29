export type PollType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE";

export interface PollOption {
  optionId: number;
  optionText: string;
  optionOrder: number;
  voteCount: number;
  isSelectedByMe: boolean;
}

export interface Poll {
  pollId: number;
  question?: string;
  pollType: PollType;
  endDate?: string;
  isEnded: boolean;
  options: PollOption[];
  totalVoters: number;
  hasVoted: boolean;
}

export interface PollCreateData {
  question?: string;
  pollType: PollType;
  endDate?: string;
  options: string[];
}

export interface VoteRequest {
  optionIds: number[];
}
