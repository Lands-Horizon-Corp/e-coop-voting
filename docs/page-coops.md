# Coops

**URL:** `/admin/coops` · **Who:** `root` only · Back to [[page-admin|Admin]]

## What it's for
A coop (cooperative) is the top-level organization. Every branch, user and event sits under a coop. Create a coop first, then add its [[page-branches|branches]].

## What the table shows

**ADD IMAGE HERE - Screenshot of the coops table with its search box, filters and rows visible**

| Column           | Meaning                                                              |
| ---------------- | -------------------------------------------------------------------- |
| Actions          | ☰ menu (see below)                                                   |
| ID               | Coop ID (uppercase)                                                  |
| Cooperative Name | Logo + name. Falls back to the first two letters if there is no logo |
| Branches         | Number of branches under the coop                                    |
| Date Created     | e.g. `Oct 23, 2026`                                                  |

Toolbar: search, column visibility, refresh, **Add Coop**. Pagination 20/40/60/80/100.

## Create

**ADD IMAGE HERE - Screenshot of the create coop form, filled in with sample values**
**Add Coop** opens *Create Coop*:

| Field | Required | Notes |
| --- | --- | --- |
| Logo | No | Image picker. Resized to max 300px and about 0.5 MB before upload |
| Coop Name | Yes | |
| Coop Description | Yes | Short description |

Saving records who created it. If no logo is picked the default image is used.

## Update

**ADD IMAGE HERE - Screenshot of the edit coop form opened from a row**
Row menu → **Edit Coop**. Same form as create, prefilled. Name, description and logo can be changed. Picking a new logo replaces the old one.

## Delete

**ADD IMAGE HERE - Screenshot of the delete coop confirmation dialog**
Row menu → **Delete Coop**. The confirmation warns that everything under the coop (branches, users, events) will be deleted.

You **can't** delete a coop that has a `root` user, or the coop your own account belongs to.

## Row actions

**ADD IMAGE HERE - Screenshot of the row actions menu open on one coop**
- **Copy Coop ID**: currently does nothing (the click handler is empty). Copy the ID from the ID column instead.
- **Edit Coop**
- **Delete Coop**

## Good to know
- Deleting a coop is permanent (not a soft delete), unlike branches and events.
- Next: [[page-branches|Branches]].
