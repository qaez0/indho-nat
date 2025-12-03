import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import CopyIcon from '../../../assets/icons/copy-icon.svg';

interface InviteLinkSectionProps {
  inviteLink: string;
  registerLink?: string;
  inviteCode?: string;
  copiedInviteLink: boolean;
  copiedRegisterLink?: boolean;
  copiedCode?: boolean;
  onCopyInviteLink: () => void;
  onCopyRegisterLink?: () => void;
  onCopyCode?: () => void;
  // Legacy props for backward compatibility
  copied?: boolean;
  onCopy?: () => void;
}

export const InviteLinkSection: React.FC<InviteLinkSectionProps> = ({
  inviteLink,
  registerLink,
  inviteCode,
  copiedInviteLink,
  copiedRegisterLink,
  copiedCode,
  onCopyInviteLink,
  onCopyRegisterLink,
  onCopyCode,
  // Legacy props for backward compatibility
  copied,
  onCopy,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Use legacy props if new props are not provided (for backward compatibility)
  const finalCopiedInviteLink = copiedInviteLink ?? copied ?? false;
  const finalOnCopyInviteLink = onCopyInviteLink || onCopy || (() => {});

  const LinkInput = ({
    title,
    value,
    copied,
    onCopy,
  }: {
    title: string;
    value: string;
    copied: boolean;
    onCopy: () => void;
  }) => (
    <View
      style={[
        styles.inviteLinkBox,
        { borderColor: theme['color-success-500'] },
      ]}
    >
      <Text style={styles.inviteLinkTitle}>{title}:</Text>
      <View
        style={[
          styles.inviteLinkDivider,
          { backgroundColor: theme['color-success-500'] },
        ]}
      />
      <TextInput
        style={styles.inviteLinkInput}
        value={value}
        editable={false}
        numberOfLines={1}
      />
      <TouchableOpacity
        style={[
          styles.copyButton,
          { backgroundColor: copied ? '#666' : theme['color-success-500'] },
        ]}
        onPress={onCopy}
      >
        {copied ? (
          <Text style={styles.copyButtonText}>✓</Text>
        ) : (
          <CopyIcon width={16} height={16} fill="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.inviteLinkContainer}>
      <LinkInput
        title={t('invite.invite-earn-tab.invite-link')}
        value={inviteLink}
        copied={finalCopiedInviteLink}
        onCopy={finalOnCopyInviteLink}
      />
      {registerLink !== undefined && onCopyRegisterLink && (
        <>
          <View style={styles.spacing} />
          <LinkInput
            title={t('invite.invite-earn-tab.download-app') || 'Download App'}
            value={registerLink}
            copied={copiedRegisterLink ?? false}
            onCopy={onCopyRegisterLink}
          />
        </>
      )}
      {inviteCode !== undefined && onCopyCode && (
        <>
          <View style={styles.spacing} />
          <LinkInput
            title={t('invite.invite-earn-tab.invite-code') || 'Invite Code'}
            value={inviteCode}
            copied={copiedCode ?? false}
            onCopy={onCopyCode}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inviteLinkContainer: {
    backgroundColor: '#272727',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  inviteLinkBox: {
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  inviteLinkTitle: {
    color: '#fff',
    fontSize: 12,
    marginHorizontal: 8,
  },
  inviteLinkDivider: {
    width: 1,
    height: 25,
    marginRight: 8,
  },
  inviteLinkInput: {
    flex: 1,
    color: '#ccc',
    fontSize: 12,
    paddingHorizontal: 4,
  },
  copyButton: {
    width: 30,
    height: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 30,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  spacing: {
    height: 16,
  },
});
