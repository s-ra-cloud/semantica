# Semantica

**A new way of reading philosophy.**

Semantica turns difficult philosophical texts into interactive reading environments, with tools for both readers and researchers doing close textual analysis. The first text available is Ludwig Wittgenstein's *Tractatus Logico-Philosophicus*, in **English, French and German**. 

> A project in Computational Humanities by the **Chair of Transitions** (Mohammed VI Polytechnic University).

📦 **Source:** https://github.com/s-ra-cloud/semantica

> **Status: Beta.** Some substitutions are still wrong or missing. The editorial team has verified them up to a given proposition (shown on the site). New connections to external texts are added every week. The **German version has not been proofread yet.** The website is live at https://semantica.ai/

---

## Table of contents

- [What Semantica does](#what-semantica-does)
- [Features](#features)
- [Editions used](#editions-used)
- [How the content is built](#how-the-content-is-built)
- [Team](#team)
- [Partners and acknowledgements](#partners-and-acknowledgements)
- [Contributing](#contributing)
- [Technical overview](#technical-overview)
- [Running locally](#running-locally)
- [API reference](#api-reference)
- [Project structure](#project-structure)
- [Downloading the code and database](#downloading-the-code-and-database)
- [License](#license)

---

## What Semantica does

Semantica keeps the author's original wording and adds three kinds of interactive layer on top of it. Each layer has its own colour:

| Colour | Meaning | What happens when you click |
|---|---|---|
| 🟢 **Green** | The author defines an **equivalence** between two terms (for example, *the world* ⇄ *the totality of facts*). | The term swaps with its equivalent. The rest of the sentence adjusts its grammar to match (for example, *"Le monde est…"* → *"Tous les faits sont…"*). |
| 🔵 **Blue** | The author uses a **formal, logical or mathematical expression**. | The expression is translated into plain language. |
| 🟣 **Purple** | The author **refers to an external text**. | The referenced passage is shown directly. |

The aim is to make difficult works easier to navigate **without reducing their conceptual rigour**.

### Why are some words not swappable in some propositions?

Wittgenstein sometimes uses a word in its strict technical sense and sometimes in its everyday sense. When a word is used in its ordinary meaning, replacing it with its technical equivalent would mislead the reader, so the swap is turned off in that proposition. For example, *thought* is defined as "the logical picture of facts" (3), but in the Preface Wittgenstein writes about "the truth of the thoughts" in a more general sense.

---

## Features

- **Trilingual reader.** Switch between English, French and German at any time.
- **Tree navigation.** Propositions fold and unfold following the *Tractatus*'s own decimal numbering (1, 1.1, 1.11, …).
- **Jump to proposition.** Type a number (for example `4.21`) to go straight to it.
- **Semantic substitution (green).** Swap equivalent terms, with automatic grammar agreement in French, English and German (gender, number, verb and participle agreement, pronouns).
- **Logic and maths translation (blue).** Click logical symbols, truth values (V/F, W/F, T/F) and formulas to see them in plain language. Formulas are rendered with KaTeX.
- **Diagrams.** Truth tables and other visual aids for selected propositions.
- **Connexion Graph (`/graph`).** A visual map linking *Tractatus* propositions to the authors and works they echo or argue against. Each link is labelled as **agreement**, **disagreement**, **opposition** or **neutral**. Sources include Aquinas, Occam, Spinoza, Leibniz, Kant, Darwin, Mauthner, Hertz, and Whitehead & Russell's *Principia Mathematica*. Links point to the LEGACY project library.
- **Expression database (`/editor`).** Anyone can browse the full list of substitutable expressions. Editing needs the admin password.
- **Feedback and contact form.** Report an error or suggest a synonym for a given proposition, or contact the team. Contributors who leave a name are credited.
- **Open data.** Download the full source code together with the expression database as a single ZIP file.
- **FAQ** built into the site.

---

## Editions used

| Language | Edition |
|---|---|
| English | C.K. Ogden & F.P. Ramsey translation (1922). Every occurrence of *"atomic fact"* has been replaced with *"state of affairs"* (following Pears & McGuinness) to better reflect the German *Sachverhalt*. |
| French | Translation by Gilles-Gaston Granger (Gallimard, 1993), reproduced with the permission of his estate. |
| German | Original German text. *Not proofread yet.* |

The source texts come from [The Wittgenstein Project](https://www.wittgensteinproject.org/).

---

## How the content is built

**Substitutable expressions** come from three sources:

1. **The editorial team**, working by hand.
2. **Language models**, which suggest candidate expressions. The team reviews and validates every suggestion.
3. **Readers**, who propose synonyms or equivalent expressions through the feedback button.

AI is used at some stages, but **human experts validate every result** before it goes on the site.

**Connections to other works** come from philological research and are **not automated**. The main philological sources are the Wittgenstein Archives (Bergen) and the LEGACY project.

---

## Team

- [Sacha Raoult](https://www.linkedin.com/in/sacha-raoult/)
- [Raphaël Liogier](https://fr.linkedin.com/in/raphael-liogier-573573127)
- [Laura Duparc](https://www.linkedin.com/in/laura-duparc-52504b215)
- [Eric Parisot](https://www.linkedin.com/in/eric-parisot-3719bb2a/)
- [Sofiane Baddag](https://www.linkedin.com/in/sofiane-baddag-743158145)
- Camille Bertrand
- Emma Alvarez-Seuron

The team is affiliated with the **Chair of Transitions** at Mohammed VI Polytechnic University and the **Machina Research Network**. Its work focuses on where philosophy, epistemology, and the digital and computational humanities meet.

---

## Partners and acknowledgements

### Host institutions

| Partner | Role |
|---|---|
| **Chair of Transitions**, Mohammed VI Polytechnic University (UM6P) | Hosts and runs the project. |
| **Machina Research Network** | Research network the team is affiliated with. |

### Texts and philological sources

| Partner | Role |
|---|---|
| [The Wittgenstein Project](https://www.wittgensteinproject.org/) | Provides the *Tractatus* texts in English, French and German. See also their blog post [*How to Keep Track of the Wittgensteinian World*](https://www.wittgensteinproject.org/w/index.php/Blog:How_to_Keep_Track_of_the_Wittgensteinian_World). |
| [The Wittgenstein Archives at the University of Bergen](https://wab.uib.no/) | Philological source for the connections to external texts. |
| [LEGACY project](https://legacy-um6p.1337.ma/home) (UM6P) | Philological source for the connections to external texts. The Connexion Graph links to its library and its *Great Conversation* project. |
| The daughter of Gilles-Gaston Granger | Granted the rights to the French translation. |

With thanks also to the [Centre Gilles-Gaston Granger](https://www.cggg.fr/) and David Stern.

### Institutional support

- SATT Sud Est
- [Institut Universitaire de France](https://www.iufrance.fr/)
- Computational Humanities Lab, University of Oxford is joining us starting in October 2026.

---

## Contributing

- **Report an error or suggest a synonym:** use the feedback button (💬) on the site. You can attach your message to a proposition number.
- **Contact the team:** use the *Contact* tab in the same form.
- **Get credit:** leave your name in the form and you will be listed as a contributor.

---

## Technical overview

| Layer | Stack |
|---|---|
| Frontend | React 19, TypeScript, Vite 7, Wouter (routing), TanStack Query, Tailwind CSS v4, shadcn/ui (Radix), Framer Motion, KaTeX |
| Backend | Node.js 20, Express 5, TypeScript (tsx) |
| Database | PostgreSQL 16 with Drizzle ORM (`drizzle-kit push` for schema sync) |
| Hosting | Replit (autoscale deployment) |

### How a proposition is rendered

1. The *Tractatus* text is stored as static TypeScript data (`client/src/data/tractatusRaw.ts`).
2. The expression groups (green, blue and maths/logic) are loaded from the database through the API and filtered by the current language.
3. `semanticParser` splits each proposition into plain-text, semantic, logic and maths segments. Longer matches take priority, and any `excluded_propositions` are respected.
4. Components render each segment: `SemanticWord`, `LogicWord`, `MathLogicWord` and `MathText`.
5. When a green term is swapped, `grammarAdaptations` updates the verbs, participles and pronouns that depend on it so the sentence stays grammatical.

### Data model

- **`synonym_groups`**: `id`, `language` (`en` / `fr` / `de`), `words` (text[]), `type` (`semantic` / `logic` / `math-logic`), `group_key` (links equivalent groups across languages), `excluded_propositions` (text[]).
- **`feedback`**: `id`, `proposition_id`, `language`, `message`, `name`, `email`, `type` (`feedback` / `contact`), `created_at`.
- **`app_settings`**: key/value store (for example `verified_up_to`).

The current snapshot (`semantica-expressions.json`) contains **379 expression groups**:

| | Semantic | Logic | Math-logic |
|---|---|---|---|
| EN | 23 | 91 | 8 |
| FR | 34 | 99 | 6 |
| DE | 21 | 91 | 6 |

---

## Running locally

### Requirements

- Node.js 20+
- PostgreSQL 16+

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `ADMIN_PASSWORD` | Password for the expression editor (required to edit) |
| `PORT` | Server port (default `5000`) |

### Setup

```bash
git clone https://github.com/s-ra-cloud/semantica.git
```

```bash
cd semantica && npm install
```

```bash
npm run db:push
```

```bash
npm run dev
```

Then open http://localhost:5000. To load the expressions, go to `/editor`, log in with `ADMIN_PASSWORD`, and import `semantica-expressions.json`.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Express + Vite with hot reload) |
| `npm run build` | Build the client to `dist/public` and the server to `dist/index.cjs` |
| `npm start` | Run the production build |
| `npm run check` | Type-check with `tsc` |
| `npm run db:push` | Sync the database schema with Drizzle |

---

## API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/synonym-groups` | – | List all expression groups |
| `POST` | `/api/synonym-groups` | 🔒 | Create a group |
| `PUT` | `/api/synonym-groups/:id` | 🔒 | Update a group |
| `DELETE` | `/api/synonym-groups/:id` | 🔒 | Delete a group |
| `GET` | `/api/synonym-groups/export` | – | Export all groups as JSON |
| `POST` | `/api/synonym-groups/import` | 🔒 | Import groups from JSON |
| `GET` | `/api/settings/:key` | – | Read a setting |
| `PUT` | `/api/settings/:key` | 🔒 | Update a setting |
| `POST` | `/api/feedback` | – | Submit feedback or a contact message |
| `GET` | `/api/feedback` | 🔒 | List feedback |
| `GET` | `/api/download-project` | – | Download the source code and database as a ZIP |
| `POST` | `/api/auth/login` | – | Log in with the admin password and get a token (valid 24 h) |
| `POST` | `/api/auth/logout` | 🔒 | Revoke the token |
| `GET` | `/api/auth/verify` | 🔒 | Check that a token is valid |

🔒 = needs an `Authorization: Bearer <token>` header.

---

## Project structure

```
client/
  src/
    pages/          Home (reader), Editor (expression DB), Graph (connexion graph)
    components/     SemanticWord, LogicWord, MathLogicWord, MathText,
                    TractatusDiagrams, StarSphere, ParsedText, ui/ (shadcn)
    context/        SemanticContext (shares expression groups)
    lib/            semanticParser, grammarAdaptations
    data/           Tractatus texts (EN/FR/DE) and Preface
server/             Express app, routes, storage layer, DB connection
shared/schema.ts    Drizzle schema (shared by client and server)
scrape_*.js, parse_*.js   One-off scripts that fetched the text from the Wittgenstein Project
semantica-expressions.json   Snapshot of the expression database
```

---

## Downloading the code and database

Semantica is fully open source. The **Download Source Code** button on the site (`/api/download-project`) gives you a ZIP file containing:

- the client, server and shared source code, plus configuration files
- `database/expressions.json`: every expression group
- `database/settings.json`: the current verification threshold

---

## License

Semantica is released under the **[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)**.

The *Tractatus* translations keep their own rights. The French translation by Gilles-Gaston Granger is reproduced with the permission of his estate.
