# Hikma Architecture & AI Flow Guide

Welcome to the Hikma codebase. This document is designed to help you understand how the different pieces of this application fit together, specifically focusing on the AI-driven reflection process.

## 1. The Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Orchestration**: [Genkit 1.x](https://firebase.google.com/docs/genkit)
- **Model**: [Gemini 1.5 Flash/Pro](https://deepmind.google/technologies/gemini/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database/Storage**: `localStorage` (partitioned by Firebase User ID)
- **Auth**: [Firebase Authentication](https://firebase.google.com/docs/auth)

---

## 2. The Reflection AI Flow (End-to-End)

This is the most critical "loop" in the application. Here is exactly what happens when a user requests a reflection:

### Step 1: User Input (`src/app/(protected)/reflect/page.tsx`)
The `ReflectionPage` component handles the UI state. When the user clicks "Receive Reflection":
- The `handleSubmit` function is called.
- It validates that a symbol is selected and the journal isn't empty.
- It sets `isLoading(true)` to show the spinner.

### Step 2: Server Action (`src/app/actions.ts`)
The client calls `reflectionAction(input)`.
- **Why?** We use Server Actions to keep our API keys secret on the server and to provide a clean interface for the frontend.
- **Retries**: It uses a `withRetry` helper. If the AI is "busy," it automatically tries again (up to 3 times) before giving up.

### Step 3: Genkit Flow (`src/ai/flows/generate-reflection.ts`)
This is where the "thinking" happens.
- **Context Construction**: The flow takes the user's journal, selected symbol (Element), and their previous soul profile.
- **The Prompt**: It uses a specialized prompt that instructs Gemini to speak as "Hikma"—a wise, poetic guide.
- **Structured Output**: We define a `ReflectionOutputSchema` using **Zod**. This forces the AI to return a specific JSON object (e.g., `{ poeticReflection: "...", temperamentBalance: {...} }`).
- **Normalization**: After the AI responds, the code manually "normalizes" the temperament scores so they always add up to exactly 100%.

### Step 4: The Response & UI Update
- The JSON object travels back to the `ReflectionPage`.
- The `reflection` state is updated.
- Framer Motion animations trigger to "reveal" the reflection.
- The `ArchivedReflection` is saved to `localStorage` so the user can see it later in the **Archive**.

---

## 3. Project Structure Overview

- **`src/ai/`**: The "Brain." Contains Genkit configurations and "flows" (individual AI tasks).
- **`src/app/`**: The "Skeleton."
    - `(protected)/`: Routes that require a user to be logged in.
    - `actions.ts`: The bridge between frontend and backend.
    - `layout.tsx`: The root structure (Header, Footer, Providers).
- **`src/components/`**: The "Skin."
    - `ui/`: Base Shadcn components (Buttons, Cards, Inputs).
    - Custom components: `TemperamentWheel` (Radar chart), `SoulMirror` (Visual fog/light), `BreathAnimation`.
- **`src/hooks/`**: The "Nerves."
    - `useAuth`: Handles Firebase login state.
    - `useLocalStorage`: Manages persistent user data, automatically adding the `uid` to the key for privacy.
- **`src/lib/`**: The "Logic."
    - `types.ts`: Central source of truth for all data shapes (Zod schemas).
    - `utils.ts`: Small helper functions (like `cn` for Tailwind classes).

---

## 4. Key Concepts for Juniors

### What is a "Veil"?
In this app, we use "veiling" as a psychospiritual metaphor for deflection. If the AI detects that a user is being sarcastic or defensive, it flags the reflection as `isVeiled: true`. This triggers the `UnveilingChat`, a mini-game/meditation designed to bring the user back to a state of sincerity.

### Why Zod?
AI models are unpredictable. Zod acts as a "validator" that ensures the data coming out of the AI matches exactly what the UI expects. If the AI fails to follow the format, Zod throws an error, allowing us to handle it gracefully instead of crashing the app.

### Framer Motion
We use this for "Sacred Movement." Notice how components fade and slide in. This is intentional to create a sense of peace and slow the user down, moving them from "scrolling" to "reflecting."