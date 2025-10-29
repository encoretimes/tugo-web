import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vote, updateVote, deleteVote } from "../api/poll";

export function useVote(pollId: number) {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: (optionIds: number[]) => vote(pollId, optionIds),
    onSuccess: () => {
      // 투표 후 게시물 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", pollId] });
    },
  });

  const updateVoteMutation = useMutation({
    mutationFn: (optionIds: number[]) => updateVote(pollId, optionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", pollId] });
    },
  });

  const deleteVoteMutation = useMutation({
    mutationFn: () => deleteVote(pollId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", pollId] });
    },
  });

  return {
    vote: voteMutation.mutate,
    updateVote: updateVoteMutation.mutate,
    deleteVote: deleteVoteMutation.mutate,
    isVoting:
      voteMutation.isPending ||
      updateVoteMutation.isPending ||
      deleteVoteMutation.isPending,
  };
}
