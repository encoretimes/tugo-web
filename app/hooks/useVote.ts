import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vote, updateVote, deleteVote } from '@/services/poll';
import { useToastStore } from '@/store/toastStore';
import { invalidationHelpers } from '@/lib/query-keys';

export function useVote(pollId: number) {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  const invalidateVoteQueries = () => {
    invalidationHelpers.onVoteMutation(pollId).forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  const voteMutation = useMutation({
    mutationFn: (optionIds: number[]) => vote(pollId, optionIds),
    onSuccess: () => {
      invalidateVoteQueries();
      addToast('투표가 완료되었습니다', 'success');
    },
    onError: (error: Error) => {
      addToast(
        error.message || '투표에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
  });

  const updateVoteMutation = useMutation({
    mutationFn: (optionIds: number[]) => updateVote(pollId, optionIds),
    onSuccess: () => {
      invalidateVoteQueries();
      addToast('투표가 변경되었습니다', 'success');
    },
    onError: (error: Error) => {
      addToast(
        error.message || '투표 변경에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
    },
  });

  const deleteVoteMutation = useMutation({
    mutationFn: () => deleteVote(pollId),
    onSuccess: () => {
      invalidateVoteQueries();
      addToast('투표가 취소되었습니다', 'info');
    },
    onError: (error: Error) => {
      addToast(
        error.message || '투표 취소에 실패했습니다. 다시 시도해주세요.',
        'error'
      );
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
