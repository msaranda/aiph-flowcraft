# Mitosis Feature - Prototype Specification
## Version: MVP 1.0 (Ship in 2 weeks)

## Entry Points & Discovery

### 1. Team Growth Indicator (Always Visible)
**Location:** Top navigation bar, right side  
**Component:** Live team size badge
```
[👥 15] → [👥 20 ⚠️] → [👥 25 🧬]
```
**Behavior:**
- Green (5-15): No action
- Yellow (16-24): Pulses gently, tooltip on hover
- Red with DNA emoji (25+): Attention animation

**Tooltip text at 20+:**
```
"Your team is growing! Click to see optimization options"
```

### 2. Dashboard Widget (Main Discovery Point)
**Location:** Main dashboard, top-right card  
**When appears:** Team size ≥ 18

```
┌─────────────────────────────────┐
│ Team Health Monitor        🧬   │
├─────────────────────────────────┤
│ Current size: 23 people         │
│ Optimal size: 12-15 per team    │
│                                 │
│ ▓▓▓▓▓▓▓▓░░ 73% health         │
│                                 │
│ Natural groups detected: 2      │
│                                 │
│ [Preview Smart Split →]         │
└─────────────────────────────────┘
```

## Core User Flow

### Screen 1: Split Preview (Modal)
**Triggered by:** Clicking "Preview Smart Split" or team badge  
**URL:** `/team/split-preview`

```
┌────────────────────────────────────────────────┐
│ 🧬 Smart Team Split - AI Analysis             X│
├────────────────────────────────────────────────┤
│                                                │
│  Your team naturally works in 2 groups:       │
│                                                │
│  ┌─────────────┐        ┌─────────────┐      │
│  │   CELL A    │  ←--→  │   CELL B    │      │
│  │             │   8    │             │      │
│  │ 👤 12 people│ shared │ 👤 11 people│      │
│  │             │ tasks  │             │      │
│  └─────────────┘        └─────────────┘      │
│                                                │
│  Cell A Focus:                                │
│  • Frontend Development (87% of tasks)        │
│  • Customer Dashboard Project                 │
│  • UI/UX Design Work                         │
│  Members: [avatar][avatar][avatar] +9 more   │
│                                                │
│  Cell B Focus:                                │
│  • Backend API (91% of tasks)                │
│  • Database Optimization                      │
│  • DevOps & Infrastructure                   │
│  Members: [avatar][avatar][avatar] +8 more   │
│                                                │
│  Shared Work (Embassy Layer):                 │
│  • 8 API integration tasks                    │
│  • Weekly sync meeting                        │
│  • Sprint planning coordination               │
│                                                │
│  ┌─────────────────────────────────────┐     │
│  │ ℹ️ Why split?                        │     │
│  │ • Reduce standup from 32→12 min     │     │
│  │ • Increase velocity by ~40%         │     │
│  │ • Clearer ownership & focus         │     │
│  └─────────────────────────────────────┘     │
│                                                │
│  [Try Split Mode (7 days)] [Not Now] [Never] │
└────────────────────────────────────────────────┘
```

### Screen 2: Split Configuration
**After clicking "Try Split Mode"**

```
┌────────────────────────────────────────────────┐
│ Configure Your Team Evolution                  │
├────────────────────────────────────────────────┤
│                                                │
│ STEP 1: Name Your Cells                       │
│ ┌─────────────────┐    ┌─────────────────┐   │
│ │ Cell Name:      │    │ Cell Name:      │   │
│ │ [Frontend Team] │    │ [Backend Team]  │   │
│ └─────────────────┘    └─────────────────┘   │
│                                                │
│ STEP 2: Verify Team Assignment                │
│ (Drag to adjust)                              │
│                                                │
│ Frontend Team          Backend Team           │
│ ├─ 👤 Sarah Chen      ├─ 👤 Marcus Rodriguez │
│ ├─ 👤 John Doe        ├─ 👤 Alice Johnson   │
│ ├─ 👤 Emma Wilson     ├─ 👤 Bob Smith       │
│ │  [+9 more]          │  [+8 more]          │
│                                                │
│ STEP 3: Set Embassy Hours (Team Sync)         │
│ [Weekly ▼] [Thursday ▼] [2:00 PM ▼]          │
│                                                │
│ STEP 4: Choose Mode                           │
│ ◉ Preview Mode (7 days, reversible)          │
│ ○ Full Split (Permanent after 30 days)       │
│                                                │
│ [← Back] [Start Preview →]                    │
└────────────────────────────────────────────────┘
```

### Screen 3: Active Split Mode - Workspace View
**The actual working interface after split**

```
┌─ FlowCraft ─────────────────────────────────────┐
│ [Logo] Frontend Team  [🔄 Switch to Backend]    │
│                       [👁️ Embassy View] [Merge?]│
├──────────────────────────────────────────────────┤
│                                                  │
│ 🟢 Preview Mode: Day 3 of 7  [Make Permanent]  │
│                                                  │
│ ┌─ Your Cell ──────────────────────────────┐   │
│ │ Sprint 24 - Frontend Team               │   │
│ │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │   │
│ │ │ TODO │ │ DOING│ │REVIEW│ │ DONE │  │   │
│ │ │  12  │ │  5   │ │  3   │ │  8   │  │   │
│ │ └──────┘ └──────┘ └──────┘ └──────┘  │   │
│ └────────────────────────────────────────┘   │
│                                                  │
│ ┌─ Embassy Layer (Shared) ─────────────┐      │
│ │ 🔗 8 linked tasks with Backend Team   │      │
│ │ Next sync: Thursday 2 PM (in 2 days)  │      │
│ │ [View Details]                        │      │
│ └────────────────────────────────────────┘      │
│                                                  │
│ Team Chat  | Members (12) | Settings           │
└──────────────────────────────────────────────────┘
```

### Screen 4: Embassy View (Cross-team Sync)
**Activated during Embassy Hours or via button**

```
┌────────────────────────────────────────────────┐
│ 🤝 Embassy Hour - Cross-Cell Sync             │
├────────────────────────────────────────────────┤
│ Thursday, 2:00 PM - 2:30 PM    ⏱️ 28:45       │
│                                                │
│ CRITICAL HANDOFFS (Resolve First)             │
│ ┌────────────────────────────────────────┐   │
│ │ 🔴 API endpoint /users needs update     │   │
│ │ Frontend blocked → Backend owner: Marcus│   │
│ │ [Assign] [Discuss] [Defer]             │   │
│ └────────────────────────────────────────┘   │
│                                                │
│ UPCOMING DEPENDENCIES                         │
│ • Payment flow UI needs backend by Mon        │
│ • Database migration affects 3 frontend views │
│                                                │
│ QUICK DECISIONS (Y/N)                        │
│ □ Delay feature X to next sprint?            │
│ □ Merge PR #234 despite minor issues?        │
│ □ Allocate Bob to help Frontend for 2 days?  │
│                                                │
│ [End Embassy Hour] [Extend 15 min]           │
└────────────────────────────────────────────────┘
```

## Component Behaviors

### Auto-Detection Algorithm (Runs Daily)
```javascript
// Pseudocode for prototype
detectNaturalGroups() {
  return {
    groups: [
      {
        members: [/* users who work together */],
        commonTasks: [/* task categories */],
        interaction_score: 0.87
      }
    ],
    confidence: 0.82,
    suggestedSplit: true
  }
}
```

### Progressive Disclosure Rules
1. **< 18 people**: Feature completely hidden
2. **18-24 people**: Widget appears, gentle nudges
3. **25+ people**: Active prompting, can't dismiss
4. **30+ people**: Forced decision (split or acknowledge)

### Data Persistence During Preview
- Main workspace: Read-only archive
- Cell workspaces: Full functionality
- Shared tasks: Synchronized every 5 minutes
- Rollback: One-click restore to original state

## Interactive Elements

### Hover States
- Team avatars: Show collaboration frequency
- Task cards: Highlight if shared between cells
- Cell boundaries: Show interaction volume

### Drag & Drop
- Reassign team members between cells
- Move tasks to/from Embassy Layer
- Reorder priority in Embassy View

### Real-time Updates
- Member count changes instantly
- Health score animates on change
- Preview countdown timer always visible

## Mobile Responsive Behavior
- Cells stack vertically on mobile
- Embassy View becomes full-screen modal
- Swipe between cells instead of tabs
- Bottom navigation for cell switching

## Metrics Collection (Silent)
```javascript
trackEvent('split_preview_opened', {
  team_size: 23,
  detected_groups: 2,
  confidence: 0.82
});

trackEvent('split_activated', {
  mode: 'preview',
  cell_a_size: 12,
  cell_b_size: 11,
  shared_tasks: 8
});
```

## Error States & Edge Cases

### Resistance Handling
**If user clicks "Never":**
```
"Understood. We'll hide this for 30 days.
Note: FlowCraft works best with teams under 20.
[OK] [Tell me why]"
```

### Uneven Splits
**If split would create 18 vs 5 people:**
```
"⚠️ Unbalanced split detected. Consider:
• Moving 3 people to smaller cell
• Creating 3 cells instead of 2
• Waiting for more team growth"
```

### Failed Preview
**If team wants to exit preview early:**
```
"Ending preview mode. What didn't work?
□ Too much overhead
□ Wrong team groupings  
□ Lost visibility
□ Other: [          ]
[Submit & Restore] [Keep Trying]"
```

## Success Confirmation

### After 7-Day Preview
```
┌────────────────────────────────────────┐
│ 🎉 Preview Complete - The Results     │
├────────────────────────────────────────┤
│                                        │
│ Before Split → After Split            │
│                                        │
│ Standup: 32 min → 12 min (−63%)      │
│ Velocity: 28 pts → 41 pts (+46%)     │
│ Blockers: 8/week → 3/week (−62%)     │
│ Happiness: 6.2 → 8.1 (+31%)          │
│                                        │
│ Make this permanent?                  │
│                                        │
│ [Yes, Keep Split] [Extend Preview]    │
│ [Return to Single Team]               │
└────────────────────────────────────────┘
```

---

## Deliverables for Development Team

1. **Frontend Components:**
   - TeamSizeIndicator (navbar)
   - TeamHealthWidget (dashboard)
   - SplitPreviewModal
   - SplitConfigWizard
   - CellWorkspace
   - EmbassyView

2. **Backend Endpoints:**
   - GET `/api/team/split-analysis`
   - POST `/api/team/split-preview`
   - POST `/api/team/split-execute`
   - POST `/api/team/split-rollback`
   - GET `/api/embassy/shared-tasks`

3. **Database Changes:**
   - New table: `team_cells`
   - New table: `embassy_tasks`
   - New fields: `workspace.is_cell`, `workspace.parent_id`

4. **Real-time Sync:**
   - WebSocket events for Embassy updates
   - Cell membership changes
   - Shared task modifications

**Time to Ship:** 10-14 days with 2 developers, 1 designer

This is your MVP. Ship it, learn, iterate.