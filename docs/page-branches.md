# Branches

**URL:** `/admin/branches` · **Who:** `root`, `coop_root` · Back to [[page-admin|Admin]]

## What it's for
A branch is a physical or organizational unit of a coop. [[page-users|Users]] and [[page-events|events]] are attached to a branch, so create branches before them.

## What the table shows

**ADD IMAGE HERE - Screenshot of the branches table with its search box, filters and rows visible**
The list is scoped by role: `root` sees all branches, `coop_root` sees branches of their own coop. Deleted branches are hidden. Newest first.

| Column | Meaning |
| --- | --- |
| Actions | ☰ menu |
| ID | Branch ID |
| Branch Name | Branch picture + name |
| Address | Branch address |
| Cooperative | The parent coop's name |
| Date Created | |

Toolbar: search, column visibility, refresh, **Add Branch**. Pagination 20/40/60/80/100.

## Create

**ADD IMAGE HERE - Screenshot of the create branch form, filled in with sample values**
**Add Branch** opens *Create Branch*:

| Field | Required | Notes |
| --- | --- | --- |
| Branch Name | Yes | |
| Branch Description | Yes | |
| Branch Address | Yes | |
| Cooperative | Yes | Dropdown of [[page-coops\|coops]] |

There is no picture field on create. Add one afterwards with **Branch Logo**.

## Update

**ADD IMAGE HERE - Screenshot of the edit branch form opened from a row**
- **Edit Branch**: change name, description, address and cooperative.
- **Branch Logo**: separate popup to upload or replace the picture (resized to max 300px, about 0.5 MB).

## Delete

**ADD IMAGE HERE - Screenshot of the delete branch confirmation dialog**
Row menu → **Delete branch** (confirmation: "Are you sure to delete this branch?").

- It's a **soft delete**: the branch is marked deleted and disappears from the list, but the record stays.
- You can't delete a branch that has a `root` user, or the branch your own account belongs to.

## Row actions

**ADD IMAGE HERE - Screenshot of the row actions menu open on one branch**
- Copy Branch ID (copied to clipboard)
- Edit Branch
- Branch Logo
- Delete branch
