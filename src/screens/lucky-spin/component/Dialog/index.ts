import InviteDialog from "./InviteDialog";
import SpinRewardDialog from "./SpinRewardDialog";
import RulesDialog from "./RulesDialog";
import SpinRecordDialog from "./SpinRecordDialog";
import CashOutDialog from "./CashOutDialog";

interface DialogProps {
  open: boolean;
  onClose: () => void;
}

export {
  InviteDialog,
  SpinRewardDialog,
  RulesDialog,
  SpinRecordDialog,
  CashOutDialog,
  type DialogProps,
};
