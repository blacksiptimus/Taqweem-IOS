import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import type { Contract } from '../lib/types';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ContractDetail'>;

export function ContractDetailScreen({ route }: Props) {
  const { id } = route.params;
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error: queryError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .single();
      if (!mounted) return;
      if (queryError) setError(queryError.message);
      else setContract(data as Contract);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (error || !contract) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error || 'Contract not found'}</Text>
      </View>
    );
  }

  const cancelScript = `Hi,\n\nPlease cancel my ${contract.title || 'membership'} effective before ${
    contract.cancel_by_date || 'the renewal date'
  }. Please confirm cancellation in writing and that no further charges will apply.\n\nThank you.`;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{contract.title || 'Untitled agreement'}</Text>
      <Text style={styles.provider}>{contract.provider || 'Unknown provider'}</Text>

      <View style={styles.grid}>
        <Fact label="Cancel by" value={contract.cancel_by_date || '—'} />
        <Fact label="Renewal" value={contract.renewal_date || '—'} />
        <Fact
          label="Amount"
          value={contract.amount != null ? `$${Number(contract.amount).toFixed(2)}` : '—'}
        />
        <Fact
          label="Early exit fee"
          value={
            contract.early_termination_fee != null
              ? `$${Number(contract.early_termination_fee).toFixed(2)}`
              : '—'
          }
        />
        <Fact label="Category" value={contract.category || '—'} />
        <Fact label="File" value={contract.file_path ? 'Attached' : 'None'} />
      </View>

      {contract.notes ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Notes</Text>
          <Text style={styles.blockBody}>{contract.notes}</Text>
        </View>
      ) : null}

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Cancel help</Text>
        <Text style={styles.blockBody}>{cancelScript}</Text>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            // Clipboard can be added later with expo-clipboard
          }}
        >
          <Text style={styles.secondaryButtonText}>Copy script (coming next)</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.5,
  },
  provider: {
    marginTop: 6,
    marginBottom: 20,
    color: colors.inkMuted,
    fontSize: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  fact: {
    width: '48%',
    backgroundColor: colors.paperElevated,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  factLabel: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  factValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  block: {
    backgroundColor: colors.paperElevated,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  blockBody: {
    color: colors.inkMuted,
    lineHeight: 22,
    fontSize: 14,
  },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.accent,
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
  },
});
