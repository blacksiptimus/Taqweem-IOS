# Clause

Know what you signed — before it costs you.

iOS + Android app (Expo / React Native + TypeScript) that tracks contracts, cancel-by dates, and renewal traps.

---

## Put this project on your Mac

This repo was scaffolded in the cloud. On your MacBook, run:

```bash
mkdir -p "/Users/hazemayyad/Desktop/IOS Apps"
cd "/Users/hazemayyad/Desktop/IOS Apps"

# If this folder does not exist yet:
git clone https://github.com/blacksiptimus/Taqweem-IOS.git clause
cd clause
git fetch origin
git checkout cursor/clause-expo-setup-3303

npm install
cp .env.example .env
```

If `clause` already exists and is empty/different:

```bash
cd "/Users/hazemayyad/Desktop/IOS Apps"
rm -rf clause   # only if it is empty / safe to replace
git clone https://github.com/blacksiptimus/Taqweem-IOS.git clause
cd clause
git checkout cursor/clause-expo-setup-3303
npm install
cp .env.example .env
```

---

## 1) Fill `.env`

Open Supabase → **Project Settings → API** and set:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Keep your Anthropic/Claude key **out of the mobile app**. It belongs in a Supabase Edge Function later.

---

## 2) Run the SQL migration

In Supabase → **SQL Editor**, paste and run:

`supabase/migrations/001_contracts.sql`

This creates:
- `contracts` table + RLS
- private `contracts` storage bucket + policies

Also in Supabase → **Authentication → Providers**, enable **Email**.

---

## 3) Start the app

```bash
cd "/Users/hazemayyad/Desktop/IOS Apps/clause"
npx expo start
```

Then:
- press `i` for iOS Simulator
- press `a` for Android Emulator
- or scan the QR code with Expo Go on a phone

---

## What’s already built

- Expo TypeScript app shell
- Auth (email sign up / sign in)
- Home list sorted by cancel-by date
- Add contract (manual fields + optional PDF/photo upload)
- Contract detail + cancel email draft
- Supabase client wiring
- SQL migration for table + storage

## What’s next

- Claude extraction Edge Function (PDF/image → cancel date / fees)
- Push reminders (30/14/7/1 days)
- TestFlight + Play internal testing via EAS

---

## Project structure

```text
App.tsx
src/
  context/AuthContext.tsx
  lib/supabase.ts
  lib/types.ts
  navigation/types.ts
  screens/
    LoginScreen.tsx
    HomeScreen.tsx
    AddContractScreen.tsx
    ContractDetailScreen.tsx
  theme/colors.ts
supabase/migrations/001_contracts.sql
.env.example
```

---

## Accounts you already have

| Account | Used for |
|---|---|
| Expo | run / build the app |
| Supabase | auth, database, file storage |
| Claude AI | later: contract text extraction |
| Apple Developer | TestFlight / App Store |
| Google Play | internal test / Play Store |
