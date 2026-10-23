# Admin

Back to [[index|Manual home]].

Manual for the admin side of the e-Coop Voting system (`/admin`). Start here.

## Pages

| Page | URL | Purpose | Roles |
| --- | --- | --- | --- |
| [[page-coops\|Coops]] | `/admin/coops` | Top-level organizations | `root` |
| [[page-branches\|Branches]] | `/admin/branches` | Branches that belong to a coop | `root`, `coop_root` |
| [[page-users\|Users]] | `/admin/user-management` | Staff accounts and their roles | `root`, `coop_root`, `admin` |
| [[page-events\|Events]] | `/admin/events` | Events and elections | `root`, `coop_root`, `admin`, `staff` |
| [[manage-event\|Manage Event]] | `/admin/events/{id}/…` | Members, attendance, incentives, election of one event | `root`, `coop_root`, `admin`, `staff` |
| [[election\|Election]] | `/admin/events/{id}/election/…` | Positions, candidates, settings and results of an election | `root`, `coop_root`, `admin` |

The sidebar only shows the pages your role can open. Opening a page by URL without the right role shows a "not allowed" screen.

## Guides
- [[managing-an-election|Managing an Election]]: step by step, from creating the event to starting the vote.

## How the data fits together

```
Coop
 └── Branch
      ├── User (role: coop_root / admin / staff)
      └── Event
           └── Election (optional, only when category = election)
```

- A **user** belongs to a branch, and gets its coop from that branch.
- An **event** belongs to a branch and a coop.

## Roles

| Role | Sees data for |
| --- | --- |
| `root` | Everything |
| `coop_root` | Their own coop |
| `admin` | Their own branch |
| `staff` | Their own branch (read-mostly, see [[page-events|Events]]) |

This scoping applies to the Branches, Users and Events lists. (The Coops list is not filtered, but only `root` can open that page.)

## Common table behavior

**ADD IMAGE HERE - Screenshot of a table with its toolbar (search, filters, columns) highlighted**

Coops, Branches, Users and Events share one table layout:

- **Search box**: filters every column at once. Shortcut: `Ctrl/Cmd/Alt + K` focuses it (Coops and Events).
- **View options**: show or hide columns. The choice is remembered in the browser.
- **Refresh** button: reloads the list.
- **Add button** (top right): opens the create form in a popup.
- **Column headers**: click to sort.
- **Pagination**: page size picker (20/40/60/80/100) on Coops, Branches and Events; Users uses the default picker.
- **Actions** column (☰ menu on each row): copy ID, edit, delete, plus page-specific items.
- **Delete** always asks for confirmation first.
