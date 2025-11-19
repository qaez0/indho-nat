import { Text } from '@ui-kitten/components';
import { ActivityIndicator, Image, ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';
import {
  generateRandomPrize,
  generateRandomUserName,
} from '../../../constants/wheel';
import { useTranslation } from 'react-i18next';

export default function WinnerContainer() {
  const { t } = useTranslation();
  const [winners, setWinners] = useState<
    Array<{ id: string; user: string; prize: string }>
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const isOppo = winners.length % 60 === 0;
      const newWinner = {
        id: `${Date.now()}-${Math.random()}`,
        user: generateRandomUserName(),
        prize: generateRandomPrize(isOppo),
      };

      setWinners(prevWinners => [newWinner, ...prevWinners.slice(0, 5)]);
    }, 5000);
    return () => clearInterval(interval);
  }, [winners]);

  return (
    <View style={{ padding: 16, height: 160 }}>
      <View
        style={{ backgroundColor: '#F3B867', borderRadius: 16, padding: 12  ,height: 220}}
      >
        {/* Top dots */}
        <View
          style={{
            position: 'absolute',
            top: 1,
            left: 16,
            right: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 0,
        
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={`top-${i}`}
              style={{
                width: 10,
                height: 10,
                backgroundColor: 'white',
                borderRadius: 5,
             
              }}
            />
          ))}
        </View>

        {/* Bottom dots */}
        <View
          style={{
            position: 'absolute',
            bottom: 1,
            left: 16,
            right: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 0,
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={`bottom-${i}`}
              style={{
                width: 10,
                height: 10,
                backgroundColor: 'white',
                borderRadius: 5,
              }}
            />
          ))}
        </View>

        {/* Left dots */}
        <View
          style={{
            position: 'absolute',
            left: 1,
            top: 16,
            bottom: 16,
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 0,
          }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <View
              key={`left-${i}`}
              style={{
                width: 10,
                height: 10,
                backgroundColor: 'white',
                borderRadius: 5,
              }}
            />
          ))}
        </View>

        {/* Right dots */}
        <View
          style={{
            position: 'absolute',
            right: 1,
            top: 16,
            bottom: 16,
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 0,
          }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <View
              key={`right-${i}`}
              style={{
                width: 10,
                height: 10,
                backgroundColor: 'white',
                borderRadius: 5,
              }}
            />
          ))}
        </View>
        <Image
          source={require('../../../assets/wheel/trophy-rec.png')}
          style={{
            width: 100,
            height: 100,
            position: 'absolute',
            top: -30,
            left: -25,
            zIndex: 1,
          }}
        />
        <Image
          source={require('../../../assets/wheel/coin-rec.png')}
          style={{
            width: 120,
            height: 100,
            position: 'absolute',
            bottom: -30,
            right: -25,
            zIndex: 1,
          }}
        />

<ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: '#374151',
            borderRadius: 12,
            minHeight: 171,
            padding: 16,
            height: 216,
          }}
        >
          <Text
            style={{
              fontFamily: 'var(--font-roboto)',
              fontSize: 20,
              fontWeight: '700',
              textAlign: 'center',
            }}
          >
            {t('wheel.winners')}
          </Text>
          {winners.length ? (
            <View style={{ width: '100%', marginTop: 8 }}>
              {winners.map(winner => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  key={winner.id}
                >
                  <Text style={{ fontSize: 18 }}>{winner.user}</Text>
                  <Text style={{ fontSize: 18, color: '#F3B867' }}>
                    {winner.prize}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <ActivityIndicator size="small" />
              <Text>{t('wheel.please-wait')}</Text>
            </View>
          )}
        </View>
        </ScrollView>


      </View>
    </View>
  );
}
