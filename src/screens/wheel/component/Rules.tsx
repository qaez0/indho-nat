import { Text } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

export default function LuckySpinPromotion() {
  const { t } = useTranslation();

  const tableData = [
    {
      day: t('wheel.rules.day-1'),
      loginReward: `1 ${t('wheel.rules.free-spin')}`,
      deposit: 'Rs 300',
      luckyExtraSpin: `1 ${t('wheel.rules.free-spin')}`,
    },
    {
      day: t('wheel.rules.day-2'),
      loginReward: `1 ${t('wheel.rules.free-spin')}`,
      deposit: 'Rs 300',
      luckyExtraSpin: `1 ${t('wheel.rules.free-spin')}`,
    },
    {
      day: t('wheel.rules.day-3'),
      loginReward: `1 ${t('wheel.rules.free-spin')}`,
      deposit: 'Rs 300',
      luckyExtraSpin: `2 ${t('wheel.rules.free-spin')}`,
    },
    {
      day: t('wheel.rules.day-4'),
      loginReward: `1 ${t('wheel.rules.free-spin')}`,
      deposit: 'Rs 300',
      luckyExtraSpin: `2 ${t('wheel.rules.free-spin')}`,
    },
    {
      day: t('wheel.rules.day-5'),
      loginReward: `1 ${t('wheel.rules.free-spin')}`,
      deposit: 'Rs 300',
      luckyExtraSpin: `3 ${t('wheel.rules.free-spin')}`,
    },
    {
      day: t('wheel.rules.day-6'),
      loginReward: `1 ${t('wheel.rules.free-spin')}`,
      deposit: 'Rs 300',
      luckyExtraSpin: `3 ${t('wheel.rules.free-spin')}`,
    },
    {
      day: t('wheel.rules.day-7'),
      loginReward: `1 ${t('wheel.rules.free-spin')}`,
      deposit: 'Rs 300',
      luckyExtraSpin: `3 ${t('wheel.rules.free-spin')}`,
    },
  ];

  const promoRules = [
    t('wheel.rules.promo-period') || 'Promo Period: Unlimited.',
    t('wheel.rules.settlement-cycle') ||
      'Settlement Cycle: Daily from 00:00 to 23:59.',
    t('wheel.rules.eligibility') ||
      'Eligibility: All 11ic users are qualified participants.',
    t('wheel.rules.lucky-extra-spin') ||
      'The Lucky Extra Spin is applicable only for users with a minimum deposit of 500 PKR per day.',
    t('wheel.rules.cycle-restart') ||
      'The cycle will restart if login is not continuous and will reset back to Day 1 after the 7th day.',
    t('wheel.rules.account-verification') ||
      'Account Verification: Users must not have multiple accounts. KYC verification will ensure account security for both parties.',
    t('wheel.rules.prizes') ||
      'Prizes: Cash prizes will be automatically transferred to the main wallet account. If the winning prize is a mobile phone customer service will contact you.',
    t('wheel.rules.turnover-requirement') ||
      'Turnover Requirement: Cash price winnings must meet a x1 turnover to process withdrawal.',
    t('wheel.rules.account-monitoring') ||
      'Account Monitoring: 11ic reserves the right to freeze accounts with multiple users. Winning prices will be forfeited if users do not comply with the promo rules and conditions',
    t('wheel.rules.contact-customer-service') ||
      'For more concerns or inquiries, please contact customer service for assistance.',
  ];

  return (
    <View
      style={{
        padding: 12,
      }}
    >
      <Image
        source={require('../../../assets/wheel/divider.png')}
        style={{
          width: '100%',
          position: 'absolute',
          marginVertical: -40,
          top: 0,
          left: 0,
          right: 0,
          objectFit: 'contain',
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,

          borderRadius: 16,
          padding: 12,
          backgroundColor: '#2d2d2d',
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            display: 'flex',
            gap: 5,
          }}
        >
          <Image
            source={require('../../../assets/wheel/rules-logo.png')}
            style={{ width: 24, height: 24 }}
          />
          <Text category="s1" style={{ fontWeight: '700' }}>
            {t('wheel.rules.lucky-spin-promotion-details') ||
              'Lucky Spin Promotion Details'}
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16,
            borderWidth: 1,

            borderColor: 'black',
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#181818',
              borderBottomWidth: 1,
              borderBottomColor: 'black',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: 'black',
              }}
            >
              <Text category="c1" style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>
                {t('wheel.rules.day')}
              </Text>
              {/* <Text category="c1" style={{ color: '#fff', fontSize: 14 }}>
                Login Reward
              </Text> */}
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
                flex: 1,
                borderRightWidth: 1,
                borderRightColor: 'black',
              }}
            >
              <Text category="c1" style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>
                {t('wheel.rules.minimum-deposit')}
              </Text>
           
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 12,
                flex: 1,
              }}
            >
           
              <Text category="c1" style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>
                {t('wheel.rules.lucky-extra-spin-header')}
              </Text>
            </View>
          </View>
          

          {tableData.map((item, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                borderBottomWidth: index === tableData.length - 1 ? 0 : 1,
                borderBottomColor: 'black',
                backgroundColor: '#3a3a3a',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                    flex: 1,
                    borderRightWidth: 1,
                    borderRightColor: 'black',
                  }}
                >
                  <Text category="c1" style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>
                    {item.day}
                  </Text>
                  {/* <Text category="c1" style={{ color: '#fff', fontSize: 14 }}>
                    {item.loginReward}
                  </Text> */}
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                    flex: 1,
                    borderRightWidth: 1,
                    borderRightColor: 'black',
                  }}
                >
                  <Text category="c1" style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>
                    {item.deposit}
                  </Text>
              
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 12,
                    flex: 1,
                  }}
                >
              
                  <Text category="c1" style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>
                    {item.luckyExtraSpin}
                  </Text>
                </View>


              </View>
            </View>
          ))}
        </View>

        <View style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <Text category="c1" style={{ color: '#fff', fontSize: 14 }}>
            {t('wheel.rules.promo-rules')}
          </Text>
          {promoRules.map((rule, index) => (
            <Text
              key={index}
              category="c2"
              style={{ lineHeight: 22, color: '#ffffff80', fontSize: 12 }}
            >{`${index + 1}. ${rule}`}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}
