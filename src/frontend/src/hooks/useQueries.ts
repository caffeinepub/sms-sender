import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SmsRecord, SmsResponse } from "../backend.d";
import { useActor } from "./useActor";

export function useGetSmsHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<SmsRecord[]>({
    queryKey: ["smsHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSmsHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendSms() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<SmsResponse, Error, { phone: string; message: string }>({
    mutationFn: async ({ phone, message }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendSms(phone, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smsHistory"] });
    },
  });
}
