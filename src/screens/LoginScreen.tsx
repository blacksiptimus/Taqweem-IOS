import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export function LoginScreen() {
  const { signIn, signUp, configured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setBusy(true);
    const message =
      mode === 'signin'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);
    setBusy(false);
    if (message) setError(message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.hero}>
        <Text style={styles.brand}>Clause</Text>
        <Text style={styles.tagline}>Know what you signed — before it costs you.</Text>
      </View>

      {!configured ? (
        <View style={styles.card}>
          <Text style={styles.warningTitle}>Connect Supabase</Text>
          <Text style={styles.warningBody}>
            Copy `.env.example` to `.env` and add your Supabase URL and anon key, then restart Expo.
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="you@email.com"
            placeholderTextColor={colors.inkMuted}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={colors.inkMuted}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.primaryButton} onPress={onSubmit} disabled={busy}>
            {busy ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
            style={styles.switchRow}
          >
            <Text style={styles.switchText}>
              {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
            </Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    justifyContent: 'center',
    padding: 24,
  },
  hero: {
    marginBottom: 28,
  },
  brand: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 24,
    color: colors.inkMuted,
    maxWidth: 320,
  },
  card: {
    backgroundColor: colors.paperElevated,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
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
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  switchRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: colors.danger,
    marginBottom: 10,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  warningBody: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  },
});
