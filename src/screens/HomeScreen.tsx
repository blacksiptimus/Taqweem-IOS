import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { Contract } from '../lib/types';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function HomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setError(null);
    const { data, error: queryError } = await supabase
      .from('contracts')
      .select('*')
      .eq('user_id', user.id)
      .order('cancel_by_date', { ascending: true, nullsFirst: false });

    if (queryError) {
      setError(queryError.message);
    } else {
      setContracts((data as Contract[]) ?? []);
    }
    setLoading(false);
    setRefreshing(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void load();
    }, [load])
  );

  const upcoming = contracts.filter((c) => {
    const d = daysUntil(c.cancel_by_date);
    return d !== null && d <= 30;
  }).length;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>Clause</Text>
          <Text style={styles.subtitle}>
            {upcoming > 0
              ? `${upcoming} deadline${upcoming === 1 ? '' : 's'} in the next 30 days`
              : 'No cancel deadlines in the next 30 days'}
          </Text>
        </View>
        <Pressable onPress={() => void signOut()}>
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={contracts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void load();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Add your first agreement</Text>
              <Text style={styles.emptyBody}>
                Upload a lease, gym plan, or phone contract and track the cancel-by date.
              </Text>
            </View>
          }
          ListHeaderComponent={
            error ? <Text style={styles.error}>{error}</Text> : null
          }
          renderItem={({ item }) => {
            const days = daysUntil(item.cancel_by_date);
            return (
              <Pressable
                style={styles.row}
                onPress={() => navigation.navigate('ContractDetail', { id: item.id })}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{item.title || 'Untitled agreement'}</Text>
                  <Text style={styles.rowMeta}>
                    {item.provider || 'Unknown provider'}
                    {item.cancel_by_date ? ` · cancel by ${item.cancel_by_date}` : ''}
                  </Text>
                </View>
                {days !== null ? (
                  <View style={[styles.badge, days <= 7 && styles.badgeUrgent]}>
                    <Text style={[styles.badgeText, days <= 7 && styles.badgeTextUrgent]}>
                      {days < 0 ? 'Missed' : `${days}d`}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          }}
        />
      )}

      <Pressable style={styles.fab} onPress={() => navigation.navigate('AddContract')}>
        <Text style={styles.fabText}>Add contract</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 4,
    color: colors.inkMuted,
    fontSize: 14,
  },
  signOut: {
    color: colors.accent,
    fontWeight: '600',
    marginTop: 8,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  row: {
    backgroundColor: colors.paperElevated,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  rowMeta: {
    marginTop: 4,
    color: colors.inkMuted,
    fontSize: 13,
  },
  badge: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeUrgent: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 12,
  },
  badgeTextUrgent: {
    color: colors.danger,
  },
  empty: {
    marginTop: 48,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  emptyBody: {
    color: colors.inkMuted,
    lineHeight: 22,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 28,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  fabText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: colors.danger,
    marginBottom: 12,
  },
});
