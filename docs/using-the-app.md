# Using the App

A walkthrough for first-time admins: how to sign in, find your way around, and set things up in the right order. Detailed per-page references are in [[page-admin|Admin]].

## Signing in

**ADD IMAGE HERE - Screenshot of the sign-in page**
1. Open the site's home page. It has two buttons: **Go to Events** (public events) and **Go to Admin**.
2. Click **Go to Admin**. If you're not signed in you're sent to the login page (`/auth`).
3. Enter your **email** and **password**, then submit. The eye icon in the password box shows or hides what you typed.
4. On success you see "Welcome Back!" and land on the first admin page your role can open. A wrong login shows an error message instead.

Accounts are created by an admin, there is no self sign-up. Ask your `coop_root` or `admin` for one (see [[page-users|Users]]).

## Finding your way around

**ADD IMAGE HERE - Screenshot of the sidebar menu and the top bar, with the main items visible**
- **Sidebar** (left): lists only the pages your role can open.
  - **Coops**, **Branches**, **Users**, **Events**
  - **Go to Events**: the public events pages
  - **Log Out** (asks to confirm)
- **Top bar**: your name and picture, the **breadcrumbs** showing where you are, and the light/dark **theme toggle**.
- If your role has no pages, the app says so and you'll need an admin to change your role.

What each role sees:

| Role        | Description                     | Pages                          |
| ----------- | ------------------------------- | ------------------------------ |
| `root`      | Lands Horizon user / Tita Nelma | Coops, Branches, Users, Events |
| `coop_root` | Coop CEO / owner               | Branches, Users, Events        |
| `admin`     | Coop admin                      | Users, Events                  |
| `staff`     | Coop staff                      | Events                         |

## Working with tables

**ADD IMAGE HERE - Screenshot of a table showing the search box, column visibility, pagination and row menu**
Every list page works the same way:
- Type in the **search box** to filter (`Ctrl/Cmd/Alt + K` to jump to it on Coops and Events).
- Click a **column header** to sort.
- Use **view options** to hide columns, and **refresh** to reload.
- Use the **Add** button (top right) to create a record, and the **☰ menu** on a row to copy its ID, edit it, or delete it.
- Deleting always asks you to confirm.
- A row menu that says *not allowed* means your role can't act on that record.

## First-time setup order
Records depend on each other, so create them in this order.

### Step 1. Create the coop
Done by `root` in [[page-coops|Coops]]. Click **Add Coop**, then fill in:
- **Coop Name** (required)
- **Coop Description** (required)
- **Logo** (optional)

The coop is the organization everything else belongs to.

### Step 2. Create branches for that coop
Done by `root` or `coop_root` in [[page-branches|Branches]]. Click **Add Branch**, fill in the name, description and address, and pick the coop it belongs to.

Branches are where users and events get bound, so you need at least one before Step 3. We recommend creating a **main branch** for each coop first. Add a logo later with **Branch Logo** in the row menu.

### Step 3. Create the users
In [[page-users|Users]], click **Add User** for each person. Pick the role that fits:

| Person | Role | Description |
| --- | --- | --- |
| Coop owner | `coop_root` | CEO/owner of the coop. Manages the whole coop: its branches, users and events |
| Coop admins | `admin` | Manages the users and events of their own branch |
| Coop staff | `staff` | Works on their branch's events, but can't create, edit or delete them |

**Select the correct branch for each user.** The branch decides what they can see and manage:
- `coop_root` sees everything in their coop.
- `admin` and `staff` only see the users and events of their own branch.

A user on the wrong branch won't see the events they should work on, so double-check before saving. Role details are in [[page-users#Role meanings|Role meanings]].

### Step 4. Manage events
In [[page-events|Events]], create an event (category `election` also creates an election), then use **Manage** to work with its members, attendance and election.

> More detail on managing events (election and attendance) will be added later.

## Everyday tasks

| I want to… | Do this |
| --- | --- |
| Add a person who can log in | Users → **Add User** |
| Change someone's role or branch | Users → ☰ → **Edit User** |
| Reset someone's password | Users → ☰ → **Edit User** → enter a new password (8 to 15 characters) |
| Change a profile or logo picture | ☰ → **Change Image** / **Branch Logo**, or the picture picker in the edit form |
| Share the registration link | Events → QR icon → copy the link or download the QR |
| Create an election | Events → **Add Event** → category `election` |
| Manage an event's members | Events → **Manage** |
| Sign out | Sidebar → **Log Out** |

## Good to know
- You can't delete your own account.
- `staff` can view events but can't create, edit or delete them.

![[Pasted image 20261023130630.png]]
