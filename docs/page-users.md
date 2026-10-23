# Users

**URL:** `/admin/user-management` · **Who:** `root`, `coop_root`, `admin` · Back to [[page-admin|Admin]]

## What it's for
Manages the accounts that log into the admin side: who they are, which branch they belong to, and what role they have.

## Roles

| Role | Can be created / edited by |
| --- | --- |
| `coop_root` | `root` |
| `admin` | `root`, `coop_root` |
| `staff` | `root`, `coop_root`, `admin` |
| `root` | Nobody through this page |

The Role dropdown only lists roles you are allowed to assign. A role is only editable by the roles listed above.

## What the table shows

**ADD IMAGE HERE - Screenshot of the users table with its search box, filters and rows visible**
The list is scoped by role: `root` sees all users, `coop_root` their coop's users, `admin` their branch's users. Newest first.

| Column | Meaning |
| --- | --- |
| Actions | ☰ menu, or *not allowed* (see below) |
| ID | User ID |
| Name | Picture + name |
| Email | Login email |
| Role | Badge, or *no role assigned* |
| Branch | Branch picture + name |
| Cooperative | Coop logo + name |
| Date joined | |

Toolbar: search, column visibility, refresh, **Add User**.

## Create

**ADD IMAGE HERE - Screenshot of the create user form, filled in with sample values**
**Add User** opens *Create User*:

| Field | Required | Rules |
| --- | --- | --- |
| Name | Yes | |
| Email | Yes | Must be a valid email |
| Password | Yes | 8 to 15 characters. Stored hashed |
| Role | Yes | Only roles you may assign |
| Branch | Yes | Dropdown of branches. The user's coop is taken from the branch automatically |

If there are no branches the form says "theres no branches available". Create a [[page-branches|branch]] first.

## Update

**ADD IMAGE HERE - Screenshot of the edit user form opened from a row**
Row menu → **Edit User**: name, email, role and branch. Password is optional here; leave it blank to keep the current one. The branch dropdown is only enabled for `root` and `coop_root`.

**Change Image** is a separate popup for the profile picture.

### Role meanings

**ADD IMAGE HERE - Screenshot of the role dropdown open in the create user form**
The Role dropdown in the update form (and the create form) offers these roles:

| Role | Meaning | Sees data for | Admin pages |
| --- | --- | --- | --- |
| `root` | System owner. Manages the whole platform across all coops | Everything | Coops, Branches, Users, Events |
| `coop_root` | CEO/owner of one coop. Manages that coop's branches, admins and staff | Their own coop | Branches, Users, Events |
| `admin` | Branch administrator. Manages staff and events of their branch | Their own branch | Users, Events |
| `staff` | Branch staff. Works on events but can't create, edit or delete them | Their own branch | Events only |

- There are **four** roles, not three: `coop_root` sits between `root` and `admin`.
- `admin` is scoped to a **branch**, not to the whole coop. Coop-wide access is `coop_root`.
- The dropdown only shows roles you may assign (see the table under [[#Roles]]). `root` can't be assigned here, and a user's current role stays listed even if you couldn't assign it.
- Changing a user's role changes which sidebar pages and data they see on their next load.

## Delete

**ADD IMAGE HERE - Screenshot of the delete user confirmation dialog**
Row menu → **Delete User** ("The user will not be able to login"). This **permanently removes** the account. You can't delete your own account: the menu item is greyed out on your own row.

## Who can act on whom
The Actions menu is replaced by an italic *not allowed* when the row is:
- someone with the **same role** as you,
- a `root` user,
- a `coop_root` and you are not `root`.

The exception is your **own row**, which you can always open.

## Row actions

**ADD IMAGE HERE - Screenshot of the row actions menu open on one user**
- Copy user ID
- Edit User
- Change Image
- Delete User
