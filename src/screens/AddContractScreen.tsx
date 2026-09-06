import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddContract'>;

export function AddContractScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('gym');
  const [amount, setAmount] = useState('');
  const [cancelByDate, setCancelByDate] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [earlyFee, setEarlyFee] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [busy, setBusy] = useState(false);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      setFile(result.assets[0]);
      if (!title) setTitle(result.assets[0].name.replace(/\.[^.]+$/, ''));
    }
  };

  const save = async () => {
    if (!user) return;
    if (!title.trim()) {
      Alert.alert('Missing title', 'Give this agreement a short name.');
      return;
    }

    setBusy(true);
    try {
      let filePath: string | null = null;

      if (file?.uri) {
        const ext = file.name?.split('.').pop() || 'pdf';
        filePath = `${user.id}/${Date.now()}.${ext}`;
        const response = await fetch(file.uri);
        const blob = await response.blob();
        const { error: uploadError } = await supabase.storage
          .from('contracts')
          .upload(filePath, blob, {
            contentType: file.mimeType || 'application/octet-stream',
            upsert: false,
          });
        if (uploadError) throw uploadError;
      }

      const { error } = await supabase.from('contracts').insert({
        user_id: user.id,
        title: title.trim(),
        provider: provider.trim() || null,
        category: category.trim() || null,
        amount: amount ? Number(amount) : null,
        billing_cycle: null,
        renewal_date: renewalDate || null,
        cancel_by_date: cancelByDate || null,
        notice_days: null,
        early_termination_fee: earlyFee ? Number(earlyFee) : null,
        file_path: filePath,
        raw_text: null,
        notes: notes.trim() || null,
      });

      if (error) throw error;
      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not save contract';
      Alert.alert('Save failed', message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Add agreement</Text>
      <Text style={styles.help}>
        Start with the cancel-by date. AI extraction comes next — for now, enter the key terms.
      </Text>

      <Pressable style={styles.upload} onPress={() => void pickFile()}>
        <Text style={styles.uploadTitle}>{file ? file.name : 'Attach PDF or photo'}</Text>
        <Text style={styles.uploadMeta}>Optional for MVP</Text>
      </Pressable>

      <Field label="Title" value={title} onChangeText={setTitle} placeholder="Planet Fitness membership" />
      <Field label="Provider" value={provider} onChangeText={setProvider} placeholder="Planet Fitness" />
      <Field label="Category" value={category} onChangeText={setCategory} placeholder="gym / lease / phone" />
      <Field label="Amount" value={amount} onChangeText={setAmount} placeholder="24.99" keyboardType="decimal-pad" />
      <Field
        label="Cancel by (YYYY-MM-DD)"
        value={cancelByDate}
        onChangeText={setCancelByDate}
        placeholder="2026-10-01"
        autoCapitalize="none"
      />
      <Field
        label="Renewal date (YYYY-MM-DD)"
        value={renewalDate}
        onChangeText={setRenewalDate}
        placeholder="2026-11-01"
        autoCapitalize="none"
      />
      <Field
        label="Early exit fee"
        value={earlyFee}
        onChangeText={setEarlyFee}
        placeholder="89"
        keyboardType="decimal-pad"
      />
      <Field label="Notes" value={notes} onChangeText={setNotes} placeholder="Account email, member ID…" multiline />

      <Pressable style={styles.primaryButton} onPress={() => void save()} disabled={busy}>
        {busy ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryButtonText}>Save</Text>}
      </Pressable>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences';
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
      />
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
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.5,
  },
  help: {
    marginTop: 8,
    marginBottom: 20,
    color: colors.inkMuted,
    lineHeight: 22,
  },
  upload: {
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    backgroundColor: colors.paperElevated,
  },
  uploadTitle: {
    fontWeight: '700',
    color: colors.ink,
  },
  uploadMeta: {
    marginTop: 4,
    color: colors.inkMuted,
    fontSize: 13,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.inkMuted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.white,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
