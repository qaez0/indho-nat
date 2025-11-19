import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import CopyIcon from '../../../assets/icons/copy-icon.svg';

interface InviteLinkSectionProps {
  inviteLink: string;
  copied: boolean;
  onCopy: () => void;
}

export const InviteLinkSection: React.FC<InviteLinkSectionProps> = ({
  inviteLink,
  copied,
  onCopy,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.inviteLinkContainer}>
      <View
        style={[
          styles.inviteLinkBox,
          { borderColor: theme['color-success-500'] },
        ]}>
        <Text style={styles.inviteLinkTitle}>{t('invite.invite-earn-tab.invite-link')}:</Text>
        <View
          style={[
            styles.inviteLinkDivider,
            { backgroundColor: theme['color-success-500'] },
          ]}
        />
        <TextInput
          style={styles.inviteLinkInput}
          value={inviteLink}
          editable={false}
          numberOfLines={1}
        />
        <TouchableOpacity
          style={[
            styles.copyButton,
            { backgroundColor: copied ? '#666' : theme['color-success-500'] },
          ]}
          onPress={onCopy}>
          {copied ? (
            <Text style={styles.copyButtonText}>✓</Text>
          ) : (
            <CopyIcon width={16} height={16} fill="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inviteLinkContainer: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  inviteLinkBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 10,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
