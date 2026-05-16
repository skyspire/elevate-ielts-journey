## Goal

Restrict subscribers to one IELTS type (Academic OR General) unless they buy the All Access plan. Three plans: Bi-weekly $9 CAD, Monthly $14 CAD, 3-month $29 CAD — each sold as Academic / General / All Access.

## Decisions locked in

- **Pricing**: Bi-weekly CAD 9 · Monthly CAD 14 · 3-month CAD 29 (× Academic / General / All Access)
- **Split content**: Writing T1, Reading, Recent Exams, Predictions, Sample Answers, Ebooks. Speaking, Listening, Vocabulary, Writing T2 stay shared.
- **Switching**: Not allowed mid-plan. User must upgrade to All Access.
- **Guests**: Forced to pick Academic or General on first visit (stored in localStorage), can change anytime before signup.

## Data model (localStorage, prototype-consistent)

- Add `ieltsType: 'academic' | 'general' | 'both'` to `LearnerUser` (defaults to whatever they picked as guest, locked to `'both'` if they buy All Access).
- Guest preference key: `bigielts:ielts-type` → `'academic' | 'general'`.
- Tag content items with `type?: 'academic' | 'general' | 'both'` (default `'both'`). Admin can set per item in the existing editors (small dropdown). For seeded data I'll tag the obvious ones (Writing T1 academic graphs vs GT letters; reading passages; ebooks via filename heuristic + admin override).

## New / changed files

```text
src/lib/ielts-type.ts                       NEW — useIeltsType hook, getter/setter, isUnlocked()
src/components/site/TypeGate.tsx            NEW — wraps a route, blurs + popup if wrong type
src/components/site/TypePickerModal.tsx     NEW — first-visit forced picker (Academic / General cards)
src/components/site/TypeSwitcher.tsx        NEW — header pill: [Academic] [General], lock icon on the side user doesn't own
src/components/site/UpgradeToAllAccessPopup.tsx  NEW — shown when locked user tries to access other type
src/routes/pricing.tsx                      NEW — public pricing page, 3 billing cycles × 3 type plans
src/routes/__root.tsx                       EDIT — mount TypePickerModal once
src/components/site/Header.tsx              EDIT — add TypeSwitcher + Pricing link
src/components/site/UpsellPopup.tsx         EDIT — link to new /pricing
src/lib/learner-auth.ts                     EDIT — add ieltsType field + setter
src/routes/signup.tsx                       EDIT — capture guest's chosen type into the new account
src/routes/recent-exam-questions.tsx        EDIT — filter by active type, wrap items in TypeGate logic
src/routes/predictions.tsx                  EDIT — same
src/routes/writing-samples.index.tsx        EDIT — split T1 academic vs GT, filter
src/routes/writing-samples.$questionId.tsx  EDIT — TypeGate
src/routes/ebooks.tsx + ebooks.$bookId.tsx  EDIT — filter + TypeGate
```

(Reading isn't a current route in the codebase — skip for now; same pattern applies when it's added.)

## UX flow

1. First visit → `TypePickerModal` (dismiss-blocked) asks Academic or General with two big bold cards. Selection persists.
2. Header shows `[Academic ⚡] [General 🔒]` pill — clicking the locked one for signed-out user just swaps preference; for signed-in non-All-Access it opens `UpgradeToAllAccessPopup`.
3. Practice pages filter their lists to the active type. Direct-link to an item of the wrong type → blurred page + upgrade popup.
4. `/pricing` page: cycle toggle (Bi-weekly / Monthly / 3-month) × 3 plan cards (Academic, General, All Access — All Access highlighted as "Best value"). All prices CAD.
5. Signup inherits the guest's chosen type. New "Plan" badge on profile shows current type.

## Out of scope (not building now)

- Real payments / Stripe (uses existing mock checkout pattern)
- Per-item admin tagging UI (uses sensible defaults; will add later if you want)
- Switching mid-plan logic (explicitly disabled per your choice)

Sound good?