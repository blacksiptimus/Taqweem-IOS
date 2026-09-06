# Taqweem Plate — Lifestyle Concept

A lifestyle layer on top of Taqweem: **photo a cookbook recipe → sorted data → small calculations → smart suggestions**, timed to your prayer day.

## One-line pitch

Snap a recipe from any cookbook. Plate sorts the ingredients, fits the cook time around Maghrib and Fajr, and tells you what to do next.

## Why this fits Taqweem

Taqweem already owns **time, location, and daily rhythm**. Plate uses that same rhythm for food — the most everyday lifestyle habit — without turning the app into a generic calorie tracker.

| Taqweem today | Plate adds |
| --- | --- |
| Prayer times | Cook windows between prayers |
| Dual calendar | Ramadan / fasting-aware meal tips |
| Local, private data | Recipes stay on device |
| Daily wisdom | Gentle food & pace suggestions |

## Core loop (camera → clarity)

1. **Foto** — Point at a cookbook page, magazine recipe, or handwritten card.
2. **Extract** — Title, ingredients, quantities, prep/cook minutes, servings.
3. **Sorted** — Ingredients grouped (produce, pantry, protein, dairy, spices) and optional aisle order for shopping.
4. **Calculate** — Scale servings; estimate total kitchen time; compare to time until Maghrib / Fajr / next prayer.
5. **Suggest** — Start now, start after prayer, Suhoor-friendly, Iftar-ready, or “too tight before Maghrib — prep tonight, finish tomorrow.”

## What the screen shows

- **Recipe card** — Name, servings, total minutes, source photo thumbnail.
- **Sorted ingredients** — Checklist with scaled amounts.
- **Day fit** — Simple math: `prep + cook` vs minutes until next prayer.
- **Suggestion strip** — One clear recommendation, not a wall of tips.
- **Optional modes** — Everyday, Ramadan (Suhoor / Iftar), meal-prep Sunday.

## Small calculations (keep them light)

- Servings scaler (e.g. 4 → 6 people).
- Kitchen block: prep + cook (+ rest if present).
- Prayer gap: minutes until Maghrib / Fajr / next salah.
- Fit score: *Ready before Maghrib?* / *Safe Suhoor window?*
- Shopping count: items left unchecked, grouped by category.

No heavy nutrition science in v1 — just timing, sorting, and gentle guidance.

## Suggestion examples

- “Start by **16:35** so dinner is plated before Maghrib.”
- “Only **28 min** until Maghrib — chop now, cook after prayer.”
- “Suhoor fit: light dairy + dates; skip long oven time.”
- “Scale to 6: you need **900 g chicken**, not 600 g.”
- “Shopping: 4 produce, 2 pantry, 1 protein.”

## Privacy stance (aligned with Taqweem)

- Photos processed on-device when possible; no recipe library uploaded by default.
- Favorites and scaled recipes stored locally, like themes and prayer prefs.
- Network only if the user opts into cloud OCR or shared cookbooks later.

## Scope for a first release

**In**

- Camera / photo library capture of one recipe page
- Parse → editable ingredient list + times
- Category sort + servings scale
- Prayer-aware cook window using existing Taqweem times
- One primary suggestion + save to “Tonight” / “Suhoor”

**Out (later)**

- Full meal planning week calendar
- Barcode products / fridge inventory
- Social recipe sharing
- Detailed macro tracking

## Success signal

A user photographs a cookbook page before Maghrib and, in under a minute, sees a sorted list and a clear “cook now / cook after prayer” answer.

## Working name

**Plate** (feature inside Taqweem). Alternate labels: Kitchen Rhythm, Recipe Lens, Cookbook Sort.
