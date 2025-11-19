import { useReducer } from 'react';
import { ScrollView } from 'react-native';
import CashOut from './CashOut';
import SpinWheel from './SpinWheel';
import { useLuckySpin } from '../../useLuckySpin';
import {
  CashOutDialog,
  InviteDialog,
  RulesDialog,
  SpinRecordDialog,
  SpinRewardDialog,
} from '../Dialog';

export interface Reward {
  id: number;
  envelope_event_id: number;
  player_id: string;
  reward_type: string;
  reward: number;
  total_received_reward: number;
  create_time: string;
}

interface State {
  rewardDialogVisib: boolean;
  inviteDialogVisib: boolean;
  rulesDialogVisib: boolean;
  spinRecordDialogVisib: boolean;
  cashOutDialogVisib: boolean;
  reward: Reward;
}

type Action = {
  type:
    | 'TOGGLE_REWARD_DIALOG'
    | 'TOGGLE_INVITE_DIALOG'
    | 'TOGGLE_RULES_DIALOG'
    | 'TOGGLE_SPIN_RECORD_DIALOG'
    | 'TOGGLE_CASH_OUT_DIALOG';
  reward?: Reward;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_REWARD_DIALOG':
      return {
        ...state,
        rewardDialogVisib: !state.rewardDialogVisib,
        reward: action.reward as Reward,
      };
    case 'TOGGLE_INVITE_DIALOG':
      return {
        ...state,
        inviteDialogVisib: !state.inviteDialogVisib,
      };
    case 'TOGGLE_RULES_DIALOG':
      return {
        ...state,
        rulesDialogVisib: !state.rulesDialogVisib,
      };
    case 'TOGGLE_SPIN_RECORD_DIALOG':
      return {
        ...state,
        spinRecordDialogVisib: !state.spinRecordDialogVisib,
      };
    case 'TOGGLE_CASH_OUT_DIALOG':
      return {
        ...state,
        cashOutDialogVisib: !state.cashOutDialogVisib,
        reward: action.reward as Reward,
      };
    default:
      return state;
  }
}

const initialState: State = {
  rewardDialogVisib: false,
  inviteDialogVisib: false,
  rulesDialogVisib: false,
  spinRecordDialogVisib: false,
  cashOutDialogVisib: false,
  reward: {} as Reward,
};

interface SpinProps {
  totalAmount: number;
}

const Spin = ({ totalAmount: _totalAmount }: SpinProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { eventDetails, refetchEventDetails } = useLuckySpin();
  const invitationRecord = eventDetails?.invitationRecord;
  const spinRecord = eventDetails?.spinRecord;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        padding: 12,
        gap: 10,
      }}
    >
      <InviteDialog
        open={state.inviteDialogVisib}
        onClose={() => dispatch({ type: 'TOGGLE_INVITE_DIALOG' })}
      />
      <SpinRewardDialog
        open={state.rewardDialogVisib}
        onClose={() => dispatch({ type: 'TOGGLE_REWARD_DIALOG' })}
        reward={state.reward as Reward}
      />
      <SpinRecordDialog
        spinRecord={spinRecord || []}
        inviteRecord={invitationRecord || []}
        open={state.spinRecordDialogVisib}
        onClose={() => dispatch({ type: 'TOGGLE_SPIN_RECORD_DIALOG' })}
      />
      <RulesDialog
        open={state.rulesDialogVisib}
        onClose={() => dispatch({ type: 'TOGGLE_RULES_DIALOG' })}
      />
      <CashOutDialog
        open={state.cashOutDialogVisib}
        onClose={() => {
          dispatch({ type: 'TOGGLE_CASH_OUT_DIALOG' });
          dispatch({ type: 'TOGGLE_INVITE_DIALOG' });
        }}
        total_received_reward={
          eventDetails?.eventInfo?.total_received_reward || 0
        }
        recent_reward={eventDetails?.eventInfo?.recent_reward || 0}
      />
      <CashOut
        totalAmount={eventDetails?.eventInfo?.total_received_reward || 0}
        onCashOut={() => dispatch({ type: 'TOGGLE_CASH_OUT_DIALOG' })}
        onSpinRecord={() => dispatch({ type: 'TOGGLE_SPIN_RECORD_DIALOG' })}
        onRules={() => dispatch({ type: 'TOGGLE_RULES_DIALOG' })}
      />
      <SpinWheel
        onInvite={() => dispatch({ type: 'TOGGLE_INVITE_DIALOG' })}
        onWin={reward => {
          refetchEventDetails().then(() => {
            dispatch({
              type: 'TOGGLE_REWARD_DIALOG',
              reward: reward as Reward,
            });
          });
        }}
        totalSpinLeft={eventDetails?.eventInfo?.total_spin_left || 0}
        eventEndTime={eventDetails?.eventInfo?.event_end_time || ''}
      />
    </ScrollView>
  );
};

export default Spin;
