import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import type { IEventDetails } from "../../types/envelope";
// import { api } from "../services/api"; // commented: migrate to mobile apiRequest
// import { useAuth } from "../provider/AuthProvider"; // commented: web-only provider
import {
  fetchEventDetails as fetchEventDetailsService,
  getEnvelopeSetting as getEnvelopeSettingService,
  getInviteLink as getInviteLinkService,
  pickEnvelope as pickEnvelopeService,
  pickSpin as pickSpinService,
  withdrawReward as withdrawRewardService,
} from "../../services/envelope.service";

// Types moved to src/types/envelope

export const useLuckySpin = () => {
  const isAuthenticated = true; // TODO: wire to RN auth store when available
  const setDetails = useLuckySpinStore((state) => state.setEventDetails);
  const details = useLuckySpinStore((state) => state.eventDetails);

  const getEnvelopeSetting = async () => getEnvelopeSettingService();

  const getInviteLink = async () => getInviteLinkService();

  const pickEnvelope = async (envelopeNumber: number) =>
    pickEnvelopeService(envelopeNumber);

  const pickSpin = async () => pickSpinService();

  const withdrawReward = async (_reward: number) => withdrawRewardService(_reward);

  const fetchEventDetails = async (): Promise<{
    code: number;
    data: IEventDetails;
    message: string;
  }> => fetchEventDetailsService();

  const eventDetails = useQuery({
    queryKey: ["lucky-spin-event-details"],
    queryFn: fetchEventDetails,
    enabled: isAuthenticated,
  });

  return {
    pickSpin,
    pickEnvelope,
    setDetails,
    eventDetails: eventDetails.data?.data ?? details,
    refetchEventDetails: eventDetails.refetch,
    fetchEventDetails,
    withdrawReward,
    getInviteLink,
    getEnvelopeSetting,
  };
};

interface LuckySpinStoreState {
  eventDetails: IEventDetails | null;
  setEventDetails: (details: IEventDetails) => void;
  clearEventDetails: () => void;
}

const useLuckySpinStore = create<LuckySpinStoreState>((set) => ({
  eventDetails: null,
  setEventDetails: (details) => set({ eventDetails: details }),
  clearEventDetails: () => set({ eventDetails: null }),
})); 