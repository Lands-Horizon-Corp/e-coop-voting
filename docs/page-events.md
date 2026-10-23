# Events

**URL:** `/admin/events` · **Who:** `root`, `coop_root`, `admin`, `staff` · Back to [[page-admin|Admin]]

## What it's for
An event is a gathering (for example an annual meeting) that members register for. An event can also carry an **election**. This page lists events and is the doorway to managing each one: members, attendance, incentives and the election.

## What the table shows

**ADD IMAGE HERE - Screenshot of the events table with its search box, filters and rows visible**
Scoped by role: `root` all events, `coop_root` their coop's, `admin` and `staff` their branch's. Deleted events are hidden. Newest first.

| Column | Meaning |
| --- | --- |
| Actions | ☰ menu, or *not allowed* for `staff` |
| Title | Cover image + title |
| Description | |
| Date | e.g. `Oct 23, 2026` |
| Branch / Coop | Where the event belongs |
| Address | Event location |
| Type | `event` or `election` |
| Live status | 🔴 **live** (voting open), ✅ **ended**, **unbegan** (election not started). Blank if the event has no election |
| Event QR | Opens a popup with QR codes and copyable links: **Register QR** for every event, plus **Election QR** when there's an election. Both can be downloaded |
| Manage button | **Manage Election** (event has an election) or **Manage**. Both open the event's Members page |

Toolbar: search (`Ctrl/Cmd/Alt + K`), column visibility, refresh, **Add Event**.

## Create

**ADD IMAGE HERE - Screenshot of the create event form, filled in with sample values**
**Add Event** opens *Create Event*. It is hidden for `staff`.

| Field | Required | Notes |
| --- | --- | --- |
| Event Name | Yes | |
| Description | Yes | |
| Date | Yes | |
| Event Address | Yes | |
| Branch | Yes | Locked to your own branch for `admin`. Only `root` and `coop_root` can choose |
| Category | Yes | `event` (default) or `election` |
| Election Name | Only for `election` | Field is disabled when category is `event` |
| Cover | No | Image picker. Default image used if skipped |

Choosing category `election` creates the event **and** its election in one step. The election starts as *pending*.

## Update

**ADD IMAGE HERE - Screenshot of the edit event form opened from a row**
Row menu → **Edit Event**: title, date, location, description and cover image. Registration options (open/close registration, birthday verification, search mode) live in the event's own *Event Settings* page. Hidden from `staff`.

## Delete

**ADD IMAGE HERE - Screenshot of the delete event confirmation dialog**
Row menu → **Delete**. The menu item is **enabled for `root` only**; others see it greyed out.

The event is only **hidden** from the list, not erased, even though the confirmation says "permanently".

## Row actions

**ADD IMAGE HERE - Screenshot of the row actions menu open on one event**
- Copy event ID
- Event election (opens election overview, only if the event has one)
- Manage / manage member (opens the Members page)
- Edit Event
- Delete

## Inside an event
See [[manage-event|Manage Event]] for the tabs and what each one is for.
