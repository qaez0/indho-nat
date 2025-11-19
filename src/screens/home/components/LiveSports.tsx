import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { useGameLogin } from '../../../hooks/useGameLogin';
import LinearGradient from 'react-native-linear-gradient';
import { LiveMatch } from '../../../types/live-sports';
import { SvgUri } from 'react-native-svg';
import Feather from '@react-native-vector-icons/feather';
import { ISlot } from '../../../types/slot';
import Skeleton from '../../../components/Skeleton';

const TeamLogo: React.FC<{
  uri: string;
  fallbackUri: string;
  width: number;
  height: number;
  style?: any;
}> = ({ uri, fallbackUri, width, height, style }) => {
  const [currentUri, setCurrentUri] = useState(uri);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.log(`TeamLogo error for URI: ${currentUri}`);
    if (!hasError) {
      setHasError(true);
      setCurrentUri(fallbackUri);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  useEffect(() => {
    setCurrentUri(uri);
    setHasError(false);
    setIsLoading(true);
  }, [uri]);

  // Fallback to fallbackUri if the main URI fails after a timeout
  useEffect(() => {
    if (isLoading && !hasError) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          console.log(`TeamLogo timeout fallback for URI: ${uri}`);
          setHasError(true);
          setCurrentUri(fallbackUri);
          setIsLoading(false);
        }
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeout);
    }
  }, [isLoading, hasError, uri, fallbackUri]);

  return (
    <View
      style={[
        style,
        { overflow: 'hidden', borderRadius: style?.borderRadius || 25 },
      ]}
    >
      <SvgUri
        uri={currentUri}
        width={width}
        height={height}
        style={{ borderRadius: style?.borderRadius || 25 }}
        onError={handleError}
        onLoad={handleLoad}
      />
    </View>
  );
};
const LiveSports: React.FC = () => {
  const { initializeGame } = useGameLogin();
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEidsAndOddsFromAPI = async () => {
      try {
        setLoading(true);
        const url = `https://quote-cdn.uni247.xyz/api/quote/vsb/overall-matches/light/v1/?event_type_id=4&count=6`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization:
              'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODg1YWI5NDQtNzhmMS00NmZkLTgzNTItNDc1MTJlM2VhOTY3IiwicGxheWVyX2lkIjoiaW5kaWFfMy4wX2Zvcl9kaXNwbGF5IiwibWVyY2hhbnRfY29kZSI6ImJhY2tvZmZpY2UtZDllMzIiLCJpc3N1ZWRfYXQiOiIyMDIyLTEwLTI4VDA4OjA5OjUzLjU0ODE0ODcyNloiLCJleHBpcmVzX2F0IjoiMjEyMi0xMC0yOFQwMDowMDowMC4wMDAwMDE2ODdaIn0.WEL6t_UEf8KglL-p_OLQe5xsHhDgaDelQMYZniCkcGk',
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        const fetchedMatches: LiveMatch[] = await Promise.all(
          data.data.map(async (d: any) => {
            const matchData = await fetch(
              `https://api.uni247.xyz/api/quote/score/get-live-score/?event_id=${d.event_id}&summary=1&lang=en&mstatus=inplay`,
            );
            const match = await matchData.json();
            return {
              ...d,
              team_a: {
                ...d.team_a,
                more_details: match?.sport_event?.competitors?.competitor?.find(
                  (competitor: any) =>
                    competitor?.abbreviation === d.team_a?.abbr,
                ),
              },
              team_b: {
                ...d.team_b,
                more_details: match?.sport_event?.competitors?.competitor?.find(
                  (competitor: any) =>
                    competitor?.abbreviation === d.team_b?.abbr,
                ),
              },
              more_details: match?.sport_event_status,
            };
          }),
        );
        setMatches(fetchedMatches);
      } catch (error) {
        console.error('Error fetching eids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEidsAndOddsFromAPI();
  }, []);

  const handleMatchPress = (match: LiveMatch) => {
    initializeGame(
      { url: `/Login/GameLogin/ls/lobby` } as ISlot,
      false,
      match.event_id,
    );
  };
  const hasTimePassed = (isoTime: string): boolean => {
    const target = new Date(isoTime).getTime();
    const now = Date.now();
    return target < now;
  };

  const TimeFormatter = ({ isoTime }: { isoTime: string }) => {
    const date = new Date(isoTime);

    const dayMonth = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      timeZone: 'UTC',
    });

    const hoursMinutes = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });

    return (
      <View style={{ alignItems: 'center', flexDirection: 'column', gap: 4 }}>
        <Text category="s1" style={{ fontWeight: '700' }}>
          {dayMonth.toUpperCase()}
        </Text>
        <Text category="p1" style={{ fontWeight: '400' }}>
          {hoursMinutes.toUpperCase()}
        </Text>
      </View>
    );
  };

  const renderMatch = (match: LiveMatch) => {
    const buildTeamLogoUrl = (teamId: string): string => {
      if (teamId.startsWith('https://static.uni247.xyz/images-v3/')) {
        return teamId;
      }

      let cleanId = teamId;
      if (teamId.includes('static.uni247.xyz/images-v3/')) {
        cleanId = teamId.split('static.uni247.xyz/images-v3/').pop() || teamId;
      }

      cleanId = cleanId.replace(/:/g, '');
      return `https://static.uni247.xyz/images-v3/${cleanId}.svg`;
    };

    const teamALogoUrl = buildTeamLogoUrl(match.team_a.more_details.id);
    const teamBLogoUrl = buildTeamLogoUrl(match.team_b.more_details.id);
    const defaultTeamA =
      'https://static.uni247.xyz/images-v3/srcompetitor%20home.svg';
    const defaultTeamB =
      'https://static.uni247.xyz/images-v3/srcompetitor%20away.svg';

    return (
      <TouchableOpacity
        key={match.event_id}
        style={styles.matchCardContainer}
        onPress={() => handleMatchPress(match)}
      >
        <LinearGradient
          colors={['#427518', '#293d18']}
          style={styles.matchCard}
        >
          <View style={styles.matchHeader}>
            <Text
              category="s1"
              numberOfLines={1}
              style={{ width: '70%', fontWeight: '700' }}
            >
              {match.season_name}
            </Text>
            <SvgUri
              uri={'https://static.uni247.xyz/images-v3/EX-icon.svg'}
              width={25}
              height={25}
            />
          </View>
          <View style={styles.teamsContainer}>
            <View style={styles.team}>
              <TeamLogo
                uri={teamALogoUrl}
                fallbackUri={defaultTeamA}
                width={45}
                height={45}
                style={styles.teamLogo}
              />
              <Text style={styles.teamName}>{match.team_a.abbr}</Text>
            </View>
            {hasTimePassed(match.time) ? (
              <View style={styles.timeContainer}>
                <Text
                  category="p2"
                  style={{
                    opacity: 0.8,
                    color:
                      match.more_details.match_status === 'ended'
                        ? 'red'
                        : '#fff',
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {match.more_details.match_status}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Text category="s1" style={{ fontWeight: '700' }}>
                    {match.more_details.home_score}
                  </Text>
                  <Text category="p2">:</Text>
                  <Text category="s1" style={{ fontWeight: '700' }}>
                    {match.more_details.away_score}
                  </Text>
                </View>
                <Text category="p2" style={{ fontWeight: '700' }}>
                  Ov:{match.more_details.over}
                </Text>
              </View>
            ) : (
              <TimeFormatter isoTime={match.time} />
            )}

            <View style={styles.team}>
              <TeamLogo
                uri={teamBLogoUrl}
                fallbackUri={defaultTeamB}
                width={45}
                height={45}
                style={styles.teamLogo}
              />
              <Text style={styles.teamName}>{match.team_b.abbr}</Text>
            </View>
          </View>
          {match.m && match.m.product && (
            <View style={styles.oddsContainer}>
              {match.m.product.map((product, index) => (
                <View style={styles.oddButton} key={index}>
                  <Text style={styles.oddLabel}>{index + 1}</Text>
                  {product.o > 0 ? (
                    <Text style={styles.oddText}>{product.o || '-'}</Text>
                  ) : (
                    <Feather name="lock" size={16} color="#FFFFFF80" />
                  )}
                </View>
              ))}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} width={330} height={215} borderRadius={15} />
          ))
        : matches.map(renderMatch)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 215,
  },
  contentContainer: {
    gap: 8,
  },
  matchCardContainer: {
    width: 330,
    height: 215,
  },
  matchCard: {
    flex: 1,
    borderRadius: 15,
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  sportText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
    fontFamily: 'Montserrat-SemiBold',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  team: {
    alignItems: 'center',
    gap: 4,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    fontFamily: 'Montserrat-SemiBold',
  },
  timeContainer: {
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Montserrat-SemiBold',
  },
  oddsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  oddButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  oddLabel: {
    color: '#AAA8A8',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  oddText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});

export default LiveSports;
