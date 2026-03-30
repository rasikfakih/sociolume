# Agent Skills Documentation

This document describes the agent skills available in the Sociolume project. These skills are designed to guide structured workflows for design, orchestration, and collaborative documentation.

## Skills Overview

| Skill | Purpose | Key Use Case |
|-------|---------|--------------|
| [`brainstorming`](#brainstorming) | Transform vague ideas into validated designs | Before implementing features, architecture, or behavior |
| [`agent-orchestrator`](#agent-orchestrator) | Orchestrate multi-skill workflows | Complex tasks requiring multiple specialized skills |
| [`doc-coauthoring`](#doc-coauthoring) | Collaborative document creation | Writing specs, proposals, decision docs, RFCs |

---

## brainstorming

**Purpose:** Turn raw ideas into clear, validated designs and specifications through structured dialogue before any implementation begins.

### When to Use brainstorming

- Starting a new feature or capability
- Making architectural decisions
- Designing behavior or system changes
- When ideas are vague and need validation

### When NOT to Use

- Simple, well-defined tasks
- Quick fixes or bug corrections
- Tasks where the design is already clear

### Operating Mode

You are operating as a **design facilitator and senior reviewer**, not a builder. This means:

- ❌ No creative implementation
- ❌ No speculative features
- ❌ No silent assumptions
- ❌ No skipping ahead
- ✅ Slow the process down to get it right

### The 7-Step Process

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Understand Context → 2. Understand Idea → 3. Non-Functional  │
│         ↓              ↓                    ↓                  │
│  4. Lock Understanding → 5. Explore Approaches → 6. Present       │
│                              ↓                    ↓             │
│                        (Validate First)        7. Decision Log  │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 1: Understand Current Context (Mandatory)

Before asking any questions:
- Review project state (files, docs, plans, prior decisions)
- Identify what already exists vs. what's proposed
- Note implicit but unconfirmed constraints

**Do not design yet.**

#### Step 2: Understanding the Idea

Goal: **Shared clarity**, not speed.

**Rules:**
- Ask **one question per message**
- Prefer **multiple-choice questions** when possible
- Use open-ended only when necessary
- Split complex topics into multiple questions

Focus areas:
- Purpose
- Target users
- Constraints
- Success criteria
- Explicit non-goals

#### Step 3: Non-Functional Requirements (Mandatory)

Explicitly clarify or propose assumptions for:

| Requirement | Examples |
|-------------|----------|
| Performance | Response times, throughput |
| Scale | Users, data volume, traffic |
| Security | Privacy constraints, access control |
| Reliability | Availability needs, recovery |
| Maintenance | Ownership, support expectations |

If unsure, propose defaults and mark them as **assumptions**.

#### Step 4: Understanding Lock (Hard Gate)

Before proposing any design, you MUST:

1. **Provide Understanding Summary** (5-7 bullets):
   - What is being built
   - Why it exists
   - Who it is for
   - Key constraints
   - Explicit non-goals

2. **List all Assumptions** explicitly

3. **List Open Questions** (if any)

4. **Request confirmation:**
   > "Does this accurately reflect your intent? Please confirm or correct anything before we move to design."

**Do NOT proceed until explicit confirmation is given.**

#### Step 5: Explore Design Approaches

Once understanding is confirmed:

- Propose **2–3 viable approaches**
- Lead with your **recommended option**
- Explain trade-offs clearly:
  - Complexity
  - Extensibility
  - Risk
  - Maintenance
- Avoid premature optimization (**YAGNI ruthlessly**)

This is still **not** final design.

#### Step 6: Present Design Incrementally

When presenting the design:

- Break into sections of **200–300 words max**
- After each section, ask: "Does this look right so far?"

Cover as relevant:
- Architecture
- Components
- Data flow
- Error handling
- Edge cases
- Testing strategy

#### Step 7: Decision Log (Mandatory)

Maintain a running **Decision Log** throughout:

| Field | Description |
|-------|-------------|
| What was decided | The final choice |
| Alternatives considered | Other options |
| Why chosen | Rationale for the decision |

### After the Design

**Documentation:**
- Write final design to a durable format (Markdown)
- Include: Summary, Assumptions, Decision Log, Final Design

**Implementation Handoff (Optional):**
Only after documentation is complete:
> "Ready to set up for implementation?"

---

## agent-orchestrator

**Purpose:** Meta-skill that orchestrates all agents in the ecosystem through automatic discovery, capability matching, and multi-skill coordination.

### When to Use agent-orchestrator

- Complex tasks requiring multiple specialized skills
- When uncertain which skills to use
- Tasks that span multiple domains
- Automation of multi-step workflows

### Core Principle: Zero Manual Intervention

> **Note:** The auto-discovery and Python scripts described below are planned but not yet implemented. The workflow explains the intended design.

- **ALWAYS scan** before processing any request (planned)
- New skills are **auto-detected** when SKILL.md is created (planned)
- Removed skills are **auto-excluded** from registry (planned)
- No manual commands needed to register skills (planned)

### Required Workflow (Every Request)

> **Status:** This workflow is conceptual. Python scripts are planned but not yet implemented.

```
┌──────────────────────────────────────────────────────────┐
│                     USER QUERY                           │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────────────┐
│  Step 1: AUTO-DISCOVERY (Scan Registry)                  │
│  python agent-orchestrator/scripts/scan_registry.py       │
│  (Planned - not yet implemented)                         │
│  Ultra-fast (<100ms) via MD5 hash cache                  │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────────────┐
│  Step 2: MATCH SKILLS                                    │
│  python agent-orchestrator/scripts/match_skills.py        │
│  (Planned - not yet implemented)                         │
│  Returns JSON with skills ranked by relevance            │
└─────────────────────┬───────────────────────────────────┘
                      ▼
┌──────────────────────────────────────────────────────────┐
│  Step 3: ORCHESTRATE (if matched >= 2 skills)            │
│  python agent-orchestrator/scripts/orchestrate.py         │
│  (Planned - not yet implemented)                         │
│  Returns execution plan with pattern and order           │
└──────────────────────────────────────────────────────────┘
```

### Matching Algorithm

| Criterion | Points | Example |
|-----------|--------|---------|
| Skill name in query | +15 | "use web-scraper" → web-scraper |
| Exact keyword trigger | +10 | "scrape" → web-scraper |
| Capability category match | +5 | data-extraction → web-scraper |
| Word overlap | +1 | Query words in description |
| Project boost | +20 | Skill assigned to active project |

**Minimum threshold:** 5 points. Skills below this are ignored.

### Matching Results Action

| Result | Action |
|--------|--------|
| `matched: 0` | No relevant skill. Operate normally without skills. |
| `matched: 1` | One relevant skill. Load its SKILL.md and follow it. |
| `matched: 2+` | Multiple skills. Execute Step 3 (orchestration). |

### Orchestration Patterns

#### 1. Pipeline Sequential

Skills form a chain where output from one feeds the next.

**When:** Mix of "producer" skills (data extraction) and "consumer" skills (messaging).

```
user_query → web-scraper → whatsapp-cloud-api → result
```

#### 2. Parallel Execution

Skills work independently on different aspects.

**When:** All skills have the same role (all producers or all consumers).

```
user_query → [instagram, whatsapp] → aggregated_result
```

#### 3. Primary + Support

One main skill leads; others provide supporting data.

**When:** Core task with supplementary information needs.

### Registry Location

> **Note:** Registry file will be created at this location when implemented.

```
agent-orchestrator/data/registry.json
```

### Registry Scan Locations (Planned - Not Yet Implemented)

> These scan locations describe where the system will look for skills once implemented.

1. `.claude/skills/*/` — Skills registered in Claude Code
2. `*/` — Standalone skills at top-level
3. `*/*/` — Skills in subfolders (up to depth 3)

### Registry Metadata Fields

| Field | Description |
|-------|-------------|
| `name` | Skill name (from YAML frontmatter) |
| `description` | Full description including triggers |
| `location` | Absolute directory path |
| `skill_md` | Absolute path to SKILL.md |
| `registered` | In .claude/skills/ (true/false) |
| `capabilities` | Capability tags (auto-extracted + explicit) |
| `triggers` | Activation keywords from description |
| `language` | Primary language (python/nodejs/bash/none) |
| `status` | active / incomplete / missing |

### Quick Commands (Planned - Not Yet Implemented)

> The following commands are planned for future implementation. They describe how the orchestrator will work once the Python scripts are built.

```bash
# Quick scan (uses hash cache) [Planned]
python agent-orchestrator/scripts/scan_registry.py

# Detailed status table [Planned]
python agent-orchestrator/scripts/scan_registry.py --status

# Force full re-scan (ignores cache) [Planned]
python agent-orchestrator/scripts/scan_registry.py --force

# Match with project boost [Planned]
python agent-orchestrator/scripts/match_skills.py --project my-project "query"

# Orchestrate multiple skills [Planned]
python agent-orchestrator/scripts/orchestrate.py --skills skill1,skill2 --query "query"
```

---

## doc-coauthoring

**Purpose:** Structured workflow for collaborative document creation through three stages: Context Gathering, Refinement & Structure, and Reader Testing.

### When to Use doc-coauthoring

**Trigger conditions:**
- User mentions writing docs: "write a doc", "draft a proposal", "create a spec"
- User mentions specific doc types: "PRD", "design doc", "decision doc", "RFC"
- User appears to be starting a substantial writing task

### Three-Stage Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: Context Gathering                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Meta-context questions                              │   │
│  │ • Info dumping                                        │   │
│  │ • Clarifying questions                                │   │
│  │ • Exit: Edge cases & trade-offs can be discussed      │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  STAGE 2: Refinement & Structure                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Document structure agreed                           │   │
│  │ • Section-by-section:                                │   │
│  │   1. Clarifying questions                             │   │
│  │   2. Brainstorm 5-20 options                         │   │
│  │   3. User curation                                   │   │
│  │   4. Draft section                                   │   │
│  │   5. Iterative refinement                            │   │
│  │ • Exit: All sections complete & refined              │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                 │
│  STAGE 3: Reader Testing                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Predict reader questions                            │   │
│  │ • Test with fresh perspective (sub-agent or manual)   │   │
│  │ • Fix identified gaps                                │   │
│  │ • Exit: Reader consistently gets correct answers      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Stage 1: Context Gathering

**Goal:** Close the gap between what the user knows and what the agent knows.

#### Initial Meta-Context Questions

1. What type of document is this? (e.g., technical spec, decision doc, proposal)
2. Who's the primary audience?
3. What's the desired impact when someone reads this?
4. Is there a template or specific format to follow?
5. Any other constraints or context to know?

#### Info Dumping

Encourage the user to dump all context:
- Project/problem background
- Related discussions or documents
- Why alternatives aren't being used
- Organizational context
- Timeline pressures or constraints
- Technical architecture or dependencies
- Stakeholder concerns

**Advise:** Don't worry about organizing—just get it all out.

#### Clarifying Questions

After initial dump, ask 5-10 numbered questions based on gaps in context.

**Answer format:** Can use shorthand like "1: yes, 2: see #channel, 3: no because backwards compat"

#### Exit Condition

Sufficient context when questions show understanding—when edge cases and trade-offs can be asked about without needing basics explained.

### Stage 2: Refinement & Structure

**Goal:** Build the document section by section.

#### Section Workflow (repeat for each section)

```
Clarifying Questions → Brainstorm Options → User Curation → 
Draft → Iterative Refinement → Next Section
```

#### Step 1: Clarifying Questions

Ask 5-10 specific questions about what to include in this section.

#### Step 2: Brainstorm

Generate 5-20 numbered options based on:
- Context shared earlier
- Angles not yet mentioned

#### Step 3: Curation

Ask which points to keep/remove/combine.

Example response format:
- "Keep 1,4,7,9"
- "Remove 3 (duplicates 1)"
- "Combine 11 and 12"

#### Step 4: Gap Check

Ask if anything important is missing for this section.

#### Step 5: Draft

Replace placeholder with actual content based on selections.

#### Step 6: Iterative Refinement

Make edits based on feedback:
- Use surgical edits (never reprint whole doc)
- After each edit, ask what to change
- After 3 consecutive iterations with no changes, ask if anything can be removed

#### Near Completion

Before finishing:
- Re-read entire document
- Check for flow, consistency, redundancy
- Remove anything that feels like generic filler

### Stage 3: Reader Testing

**Goal:** Verify the document works for readers.

#### Testing Approach

**With sub-agent access:**
1. Predict 5-10 questions readers might ask
2. Test each with a fresh sub-agent (no context)
3. Run additional checks for ambiguity, contradictions
4. Fix identified gaps

**Without sub-agent access:**
1. Generate test questions
2. Provide instructions for manual testing with fresh Claude
3. Iterate based on results

#### Exit Condition

Reader Claude consistently answers questions correctly with no new gaps or ambiguities surfaced.

#### Final Steps

1. User does a final read-through
2. Double-check facts, links, technical details
3. Verify it achieves the intended impact

### Tips for Effective Guidance

**Tone:**
- Be direct and procedural
- Explain rationale briefly when it affects behavior
- Don't "sell" the approach—just execute it

**Handling Deviations:**
- If user wants to skip a stage: Offer to skip and write freeform
- If user seems frustrated: Acknowledge and suggest ways to move faster
- Always give user agency to adjust the process

**Quality over Speed:**
- Don't rush through stages
- Each iteration should make meaningful improvements
- Goal is a document that actually works for readers

---

## Quick Reference Guide

| Task | Use This Skill |
|------|----------------|
| Design a new feature | [`brainstorming`](#brainstorming) |
| Make architectural decisions | [`brainstorming`](#brainstorming) |
| Complex task needing multiple skills | [`agent-orchestrator`](#agent-orchestrator) |
| Unknown which skills to use | [`agent-orchestrator`](#agent-orchestrator) |
| Write a spec, proposal, or RFC | [`doc-coauthoring`](#doc-coauthoring) |
| Create a decision document | [`doc-coauthoring`](#doc-coauthoring) |
| Write technical documentation | [`doc-coauthoring`](#doc-coauthoring) |