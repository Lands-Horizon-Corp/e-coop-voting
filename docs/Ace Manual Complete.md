# e-Coop Voting Manual

Manual for the e-Coop ACE System (Attendance Capturing & Election System).


## Getting started


### Using the App

A walkthrough for first-time admins: how to sign in, find your way around, and set things up in the right order. Detailed per-page references are in [Admin](#admin).

#### Signing in

![[Pasted image 20261023151920.png]]
1. Open the site's home page. It has two buttons: **Go to Events** (public events) and **Go to Admin**.
2. Click **Go to Admin**. If you're not signed in you're sent to the login page (`/auth`).
3. Enter your **email** and **password**, then submit. The eye icon in the password box shows or hides what you typed.
4. On success you see "Welcome Back!" and land on the first admin page your role can open. A wrong login shows an error message instead.

Accounts are created by an admin, there is no self sign-up. Ask your `coop_root` or `admin` for one (see [Users](#users)).

#### Finding your way around

![[Pasted image 20261023152127.png]]
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

#### Working with tables

![[Pasted image 20261023152235.png]]pagination and row menu**
Every list page works the same way:
- Type in the **search box** to filter (`Ctrl/Cmd/Alt + K` to jump to it on Coops and Events).
- Click a **column header** to sort.
- Use **view options** to hide columns, and **refresh** to reload.
- Use the **Add** button (top right) to create a record, and the **☰ menu** on a row to copy its ID, edit it, or delete it.
- Deleting always asks you to confirm.
- A row menu that says *not allowed* means your role can't act on that record.

#### First-time setup order
Records depend on each other, so create them in this order.

##### Step 1. Create the coop
Done by `root` in [Coops](#coops). Click **Add Coop**, then fill in:
- **Coop Name** (required)
- **Coop Description** (required)
- **Logo** (optional)

The coop is the organization everything else belongs to.

##### Step 2. Create branches for that coop
Done by `root` or `coop_root` in [Branches](#branches). Click **Add Branch**, fill in the name, description and address, and pick the coop it belongs to.

Branches are where users and events get bound, so you need at least one before Step 3. We recommend creating a **main branch** for each coop first. Add a logo later with **Branch Logo** in the row menu.

##### Step 3. Create the users
In [Users](#users), click **Add User** for each person. Pick the role that fits:

| Person | Role | Description |
| --- | --- | --- |
| Coop owner | `coop_root` | CEO/owner of the coop. Manages the whole coop: its branches, users and events |
| Coop admins | `admin` | Manages the users and events of their own branch |
| Coop staff | `staff` | Works on their branch's events, but can't create, edit or delete them |

**Select the correct branch for each user.** The branch decides what they can see and manage:
- `coop_root` sees everything in their coop.
- `admin` and `staff` only see the users and events of their own branch.

A user on the wrong branch won't see the events they should work on, so double-check before saving. Role details are in [Role meanings](#users).

##### Step 4. Manage events
In [Events](#events), create an event (category `election` also creates an election), then use **Manage** to work with its members, attendance and election.

> More detail on managing events (election and attendance) will be added later.

#### Everyday tasks

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

#### Good to know
- You can't delete your own account.
- `staff` can view events but can't create, edit or delete them.

!Pasted image 20261023130630.png


## Administration


### Admin

Back to Manual home.

Manual for the admin side of the e-Coop Voting system (`/admin`). Start here.

#### Pages

| Page                          | URL                             | Purpose                                                    | Roles                                 |
| ----------------------------- | ------------------------------- | ---------------------------------------------------------- | ------------------------------------- |
| [Coops](#coops)               | `/admin/coops`                  | Top-level organizations                                    | `root`                                |
| [Branches](#branches)         | `/admin/branches`               | Branches that belong to a coop                             | `root`, `coop_root`                   |
| [Users](#users)               | `/admin/user-management`        | Staff accounts and their roles                             | `root`, `coop_root`, `admin`          |
| [Events](#events)             | `/admin/events`                 | Events and elections                                       | `root`, `coop_root`, `admin`, `staff` |
| [Manage Event](#manage-event) | `/admin/events/{id}/…`          | Members, attendance, incentives, election of one event     | `root`, `coop_root`, `admin`, `staff` |
| [Election](#election)         | `/admin/events/{id}/election/…` | Positions, candidates, settings and results of an election | `root`, `coop_root`, `admin`          |

The sidebar only shows the pages your role can open. Opening a page by URL without the right role shows a "not allowed" screen.

#### Guides
- [Managing an Election](#managing-an-election): step by step, from creating the event to starting the vote.

#### How the data fits together

```
Coop
 └── Branch
      ├── User (role: coop_root / admin / staff)
      └── Event
           └── Election (optional, only when category = election)
```

- A **user** belongs to a branch, and gets its coop from that branch.
- An **event** belongs to a branch and a coop.

#### Roles

| Role | Sees data for |
| --- | --- |
| `root` | Everything |
| `coop_root` | Their own coop |
| `admin` | Their own branch |
| `staff` | Their own branch (read-mostly, see [Events](#events)) |

This scoping applies to the Branches, Users and Events lists. (The Coops list is not filtered, but only `root` can open that page.)

#### Common table behavior

Coops, Branches, Users and Events share one table layout:

- **Search box**: filters every column at once. Shortcut: `Ctrl/Cmd/Alt + K` focuses it (Coops and Events).
- **View options**: show or hide columns. The choice is remembered in the browser.
- **Refresh** button: reloads the list.
- **Add button** (top right): opens the create form in a popup.
- **Column headers**: click to sort.
- **Pagination**: page size picker (20/40/60/80/100) on Coops, Branches and Events; Users uses the default picker.
- **Actions** column (☰ menu on each row): copy ID, edit, delete, plus page-specific items.
- **Delete** always asks for confirmation first.


### Coops

**URL:** `/admin/coops` · **Who:** `root` only · Back to [Admin](#admin)

#### What it's for
A coop (cooperative) is the top-level organization. Every branch, user and event sits under a coop. Create a coop first, then add its [branches](#branches).

#### What the table shows

![[Pasted image 20261023152329.png]]

| Column           | Meaning                                                              |
| ---------------- | -------------------------------------------------------------------- |
| Actions          | ☰ menu (see below)                                                   |
| ID               | Coop ID (uppercase)                                                  |
| Cooperative Name | Logo + name. Falls back to the first two letters if there is no logo |
| Branches         | Number of branches under the coop                                    |
| Date Created     | e.g. `Oct 23, 2026`                                                  |

Toolbar: search, column visibility, refresh, **Add Coop**. Pagination 20/40/60/80/100.

#### Create

![[Pasted image 20261023152534.png]]
**Add Coop** opens *Create Coop*:

| Field | Required | Notes |
| --- | --- | --- |
| Logo | No | Image picker. Resized to max 300px and about 0.5 MB before upload |
| Coop Name | Yes | |
| Coop Description | Yes | Short description |

Saving records who created it. If no logo is picked the default image is used.

#### Update

Row menu → **Edit Coop**. Same form as create, prefilled. Name, description and logo can be changed. Picking a new logo replaces the old one.
![[Pasted image 20261023152821.png|383]]

#### Delete

Row menu → **Delete Coop**. The confirmation warns that everything under the coop (branches, users, events) will be deleted.
![[Pasted image 20261023152706.png|445]]
You **can't** delete a coop that has a `root` user, or the coop your own account belongs to.

#### Row actions

![[Pasted image 20261023152749.png|176]]
- **Copy Coop ID**: currently does nothing (the click handler is empty). Copy the ID from the ID column instead.
- **Edit Coop**
- **Delete Coop**

#### Good to know
- Deleting a coop is permanent (not a soft delete), unlike branches and events.
- Next: [Branches](#branches).


### Branches

**URL:** `/admin/branches` · **Who:** `root`, `coop_root` · Back to [Admin](#admin)

#### What it's for
A branch is a physical or organizational unit of a coop. [Users](#users) and [events](#events) are attached to a branch, so create branches before them.

#### What the table shows

![[Pasted image 20261023152934.png|700]]
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

#### Create

**Add Branch** opens *Create Branch*:

![[Pasted image 20261023153035.png|627]]

| Field | Required | Notes |
| --- | --- | --- |
| Branch Name | Yes | |
| Branch Description | Yes | |
| Branch Address | Yes | |
| Cooperative | Yes | Dropdown of [coops](#coops) |

There is no picture field on create. Add one afterwards with **Branch Logo**.

#### Update

- **Edit Branch**: change name, description, address and cooperative.
- ![[Pasted image 20261023153129.png|444]]
- **Branch Logo**: separate popup to upload or replace the picture (resized to max 300px, about 0.5 MB).
- ![[Pasted image 20261023153247.png|456]]

#### Delete


Row menu → **Delete branch** (confirmation: "Are you sure to delete this branch?").
![[Pasted image 20261023153307.png|476]]
- It's a **soft delete**: the branch is marked deleted and disappears from the list, but the record stays.
- You can't delete a branch that has a `root` user, or the branch your own account belongs to.

#### Row actions

![[Pasted image 20261023153337.png|160]]
- Copy Branch ID (copied to clipboard)
- Edit Branch
- Branch Logo
- Delete branch


### Users

**URL:** `/admin/user-management` · **Who:** `root`, `coop_root`, `admin` · Back to [Admin](#admin)

#### What it's for
Manages the accounts that log into the admin side: who they are, which branch they belong to, and what role they have.

#### Roles

| Role | Can be created / edited by |
| --- | --- |
| `coop_root` | `root` |
| `admin` | `root`, `coop_root` |
| `staff` | `root`, `coop_root`, `admin` |
| `root` | Nobody through this page |

The Role dropdown only lists roles you are allowed to assign. A role is only editable by the roles listed above.

#### What the table shows

![[Pasted image 20261023153353.png|602]]
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

#### Create

**Add User** opens *Create User*:
![[Pasted image 20261023153520.png|425]]

| Field    | Required | Rules                                                    |
| -------- | -------- | -------------------------------------------------------- |
| Name     | Yes      |                                                          |
| Email    | Yes      | Must be a valid email                                    |
| Password | Yes      | 8 to 15 characters. Stored hashed                        |
| Role     | Yes      | Only roles you may assign                                |
| Branch   | Yes      | Dropdown of branches. Make sure to select correct branch |

If there are no branches the form says "theres no branches available". Create a [branch](#branches) first.

#### Update

![[Pasted image 20261023153629.png|427]]
Row menu → **Edit User**: name, email, role and branch. Password is optional here; leave it blank to keep the current one. The branch dropdown is only enabled for `root` and `coop_root`.

**Change Image** is a separate popup for the profile picture.

![[Pasted image 20261023153837.png|431]]

##### Role meanings

![[Pasted image 20261023153658.png|438]]
The Role dropdown in the update form (and the create form) offers these roles:

| Role | Meaning | Sees data for | Admin pages |
| --- | --- | --- | --- |
| `root` | System owner. Manages the whole platform across all coops | Everything | Coops, Branches, Users, Events |
| `coop_root` | CEO/owner of one coop. Manages that coop's branches, admins and staff | Their own coop | Branches, Users, Events |
| `admin` | Branch administrator. Manages staff and events of their branch | Their own branch | Users, Events |
| `staff` | Branch staff. Works on events but can't create, edit or delete them | Their own branch | Events only |

- There are **four** roles, not three: `coop_root` sits between `root` and `admin`.
- `admin` is scoped to a **branch**, not to the whole coop. Coop-wide access is `coop_root`.
- The dropdown only shows roles you may assign (see the table under Roles). `root` can't be assigned here, and a user's current role stays listed even if you couldn't assign it.
- Changing a user's role changes which sidebar pages and data they see on their next load.

#### Delete

![[Pasted image 20261023153928.png|428]]
Row menu → **Delete User** ("The user will not be able to login"). This **permanently removes** the account. You can't delete your own account: the menu item is greyed out on your own row.

#### Who can act on whom
The Actions menu is replaced by an italic *not allowed* when the row is:
- someone with the **same role** as you,
- a `root` user,
- a `coop_root` and you are not `root`.

The exception is your **own row**, which you can always open.

#### Row actions
![[Pasted image 20261023153945.png|195]]
- Copy user ID
- Edit User
- Change Image
- Delete User


### Events

**URL:** `/admin/events` · **Who:** `root`, `coop_root`, `admin`, `staff` · Back to [Admin](#admin)

#### What it's for
An event is a gathering (for example an annual meeting) that members register for. An event can also carry an **election**. This page lists events and is the doorway to managing each one: members, attendance, incentives and the election.

#### What the table shows

![[Pasted image 20261023154029.png|426]]
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

#### Create

**Add Event** opens *Create Event*. It is hidden for `staff`.

![[Pasted image 20261023154343.png|486]]

| Field         | Required            | Notes                                                                         |
| ------------- | ------------------- | ----------------------------------------------------------------------------- |
| Event Name    | Yes                 |                                                                               |
| Description   | Yes                 |                                                                               |
| Date          | Yes                 |                                                                               |
| Event Address | Yes                 |                                                                               |
| Branch        | Yes                 | Locked to your own branch for `admin`. Only `root` and `coop_root` can choose |
| Category      | Yes                 | `event` (default) or `election`                                               |
| Election Name | Only for `election` | Field is disabled when category is `event`                                    |
| Cover         | No                  | Image picker. Default image used if skipped                                   |

Choosing category `election` creates the event **and** its election in one step. The election starts as *pending*.

#### Update

![[Pasted image 20261023154531.png|441]]
Row menu → **Edit Event**: title, date, location, description and cover image. Registration options (open/close registration, birthday verification, search mode) live in the event's own *Event Settings* page. Hidden from `staff`.

#### Delete

Row menu → **Delete**. The menu item is **enabled for `root` only**; others see it greyed out.

The event is only **hidden** from the list, not erased, even though the confirmation says "permanently".

#### Row actions

![[Pasted image 20261023154604.png|152]]
- Copy event ID
- Event election (opens election overview, only if the event has one)
- Manage / manage member (opens the Members page)
- Edit Event
- Delete

#### Inside an event
See [Manage Event](#manage-event) for the tabs and what each one is for.


### Manage Event

This is where you run a single event: its members, check-in, incentives and election. Open it from [Events](#events) by clicking **Manage** (or **Manage Election**) on the event's row.

#### Top of the page

![[Pasted image 20261023154638.png|510]]

| Part | What it shows |
| --- | --- |
| Event bar | The event's title, location and date |
| Quorum | The share of members who have registered, and the count (for example `0 / 0 members`) |
| **Open Registration** / **End Registration** button | Turns registration on or off, see Open / End Registration |
| Back | Returns to the Events list |

#### Open / End Registration

![[Pasted image 20261023154734.png|539]]
This button controls whether members can **register** for the event. Registering also counts as the member's **attendance**.

- A new event starts **closed**, so the button reads **Open Registration**. Click it to open registration.
- While registration is open the button reads **End Registration**. Click it to close registration. You can reopen it any time.
- `staff` can see the button but can't use it.

| | Registration open | Registration closed |
| --- | --- | --- |
| Members registering themselves (through the event's **Register QR**) | Allowed | They see "Event registration has been closed." |
| **Register Member** / **Unregister** in the Members tab | Allowed | Not available |

Good to know:
- Closing registration doesn't remove anyone who already registered, and the quorum stays as it is.
- A member who has already **voted** can't be unregistered.
- Even with registration open, members can't register after the event date. Whether they can register **before** the event day depends on **Event registration** in Event Settings.

#### Tabs

![[Pasted image 20261023154806.png]]

| Tab | What it's for | Who sees it |
| --- | --- | --- |
| Members | The event's member list | Everyone |
| Quick Search | Find one member fast, at the registration desk | Everyone |
| Attendance | Who has registered / attended | Everyone |
| Incentive | Items given out at the event and who claimed them | Everyone |
| Event Settings | Event details and registration rules | Everyone except `staff` |
| Election | Positions, candidates, settings and results | Everyone except `staff`, and only if the event is an election |

#### Members
The list of people who can take part in this event. Everything else (registration, voting, incentives) works from this list.

##### Toolbar

![[Pasted image 20261023154828.png]]

| Button | What it does |
| --- | --- |
| Search box | Filters the list as you type |
| Scan icon | Scans a member's passbook QR to find them |
| **View** | Shows or hides columns |
| Refresh | Reloads the list |
| **Add Member** | Adds one member by hand |
| **Export PB QR** | Exports the passbook QR codes for many members at once |
| **Send all OTP** | Sends each member their voting OTP |
| **csv import** | Adds many members at once from an Excel or CSV file (steps in [Step 2. Import the members (Excel)](#managing-an-election)) |

##### Columns

**![[Pasted image 20261023154853.png]]**

| Column | Meaning |
| --- | --- |
| Last Name, First Name, Middle | The member's name |
| Passbook No. | The member's unique number |
| Vote OTP | The code the member uses to vote |
| OTP Sent Date | When the OTP was last sent |
| Birthday | Used for birthday verification |
| Voted | Whether the member has voted |
| Status | Whether the member has registered |
| Surveyed | Whether the member has been marked as surveyed |
| PB QR | Shows the member's passbook QR |
| Contact, Email, Gender | Contact details |

##### Row actions

Click the ☰ menu on a member:

![[Pasted image 20261023155239.png|297]]

| Action | What it does |
| --- | --- |
| Copy passbook No. / Copy vote OTP | Copies it to your clipboard |
| Send OTP | Sends the member their OTP |
| Show Passbook QR | Shows the member's QR code |
| Incentive Claims | Opens the member's incentive claims |
| **Register Member** / **Unregister** | Registers the member (counts as attendance), or undoes it. Needs registration to be open |
| **Assist Vote** | Helps a member vote from this screen. Only for election events, and only for members who haven't voted |
| Surveyed / Unsurveyed | Marks the member as surveyed, or removes the mark |
| Edit Member | Changes the member's details |
| Delete | Removes the member from the event |

##### Registering members and assisting votes

Register / Create member Via create or bulk import using excel migs/masterlist upload.

![[Pasted image 20261023155132.png|576]]

The Members tab is also where an admin helps members at the event. Open the ☰ menu on a member:

| Action | What it does |
| --- | --- |
| **Register Member** | Marks the member as registered. This also counts as their **attendance**. **Unregister** undoes it. Needs registration to be open, and a member who has voted can't be unregistered |
| **Assist Vote** | Opens the voting screen for that member in a **new browser tab**, already signed in with the member's credentials. **No OTP or birthday is asked.** Only for election events, and only for members who haven't voted |

Assisted voting:
- The election must be **live**.
- It still follows **Vote Eligibility**. With `REGISTERED`, register the member first.
- The ballot, the rules (**Voting Configuration**, seats) and the vote summary are the same as for any member.
- Use it for members without a phone, or who can't verify (no OTP or birthday on record).

If the member prefers to use **their own device**, they don't need you. They open the event's public page, search for themselves, verify with an OTP or birthday if the election requires it, and vote. The whole flow is in [Member Voting](#member-voting).

#### Quick Search

![[Pasted image 20261023155451.png]]
A fast lookup for the registration desk. Type at least 3 characters of a name, or scan a member's QR code, and up to 10 matching members appear. You get the same row actions as in the Members tab, so you can register someone right away.

#### Attendance

![[Pasted image 20261023155506.png|700]]
The full registration flow, for members and for admins, is in [Member Registration and Attendance](#member-registration-and-attendance).

Shows the members who have **registered**, who registered them and when. Use it to check who is present. It has a search box, a passbook QR scanner, a refresh button and column options.

#### Incentive

![[Pasted image 20261023155520.png|700]]
For anything you give members at the event (for example a gift or a meal). Full guide: [Managing Incentives](#managing-incentives). It has four sub-tabs:

| Sub-tab | What it's for |
| --- | --- |
| Incentives | Create and manage the incentive items |
| Assignees | Choose who hands out each incentive, and how many |
| Claims Masterlist | The list of members' claims |
| Claim Reports | Reports on claims, with filters |

#### Event Settings

![[Pasted image 20261023155540.png|424]]
Change the event's details and its registration rules. Not available to `staff`.

| Setting                                         | What it does                                                                                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Title, date, location, description, cover image | The event's basic details                                                                                                                              |
| Registration Status                             | Start or end registration (the same switch as the button at the top)                                                                                   |
| Event registration                              | **On Event Date**: members can register only on the event day. **Before Event Date**: members can register in advance                                  |
| Require Birthday Verification (Registration)    | Members must give their birthday to register. Registration without a birthday is not allowed                                                           |
| Default Member Search Mode                      | How members are looked up when registering. **By Passbook** searches by passbook number. **By Name** searches by name written as `Lastname, Firstname` |

#### Election tab
Only for events created with the category `election`, and not shown to `staff`. It has five sub-tabs: DashBoard, election (overview, with start and end), Candidates, Positions and Settings. See [Election](#election) for each one, and [Managing an Election](#managing-an-election) for the step by step setup.


### Election

The **Election** tab of [Manage Event](#manage-event). It only exists for events created with category `election`, and it is hidden from `staff`. `root`, `coop_root` and `admin` can open it.

#### Suggested order
1. Create the **Positions** (what people vote for).
2. Add **Candidates** to those positions.
3. Review the **Settings** (who can vote, how they are verified, how the ballot behaves).
4. On the **election** overview, press **start**.
5. Watch the **Dashboard** while voting runs, then press **end**.

#### Sub-tabs

![[Pasted image 20261023160122.png]]

| Sub-tab | Purpose |
| --- | --- |
| **DashBoard** | Opens first. Live quorum, results and graphs, and downloadable reports |
| **election** | Overview: election details, its candidates and positions, and the **start / end** buttons |
| **Candidates** | Add, edit and remove candidates |
| **Positions** | Add, edit and remove positions |
| **Settings** | Voting rules and verification (see below) |

##### Start and end

![[Pasted image 20261023160205.png]]

On the **election** sub-tab (not shown to `staff`):
- **start** makes the election **live** so members can vote. It's disabled until the election has at least **1 position and 1 candidate**. You can still edit the election while it is live.
- **end** closes it (status **ended**). The confirmation warns that incoming votes won't be kept after that.
- Status on the Events list: *unbegan* (pending), *live*, *ended*.

##### Positions
![[Pasted image 20261023160331.png]]

Each position has:
- **Position Name**
- **Number of Seats**: how many candidates a voter may pick for it (at least 1).

##### Candidates

![[Pasted image 20261023160402.png]]
- A candidate must be someone from the event's **member list**. Adding a passbook number that isn't in the list is rejected.
- Each candidate has a first and last name, a passbook number, a position and a profile picture.

##### Dashboard

![[Pasted image 20261023160448.png|437]]
- **Quorum**: share of members who have voted.
- **Results & Graphs**: bar and pie charts per position.
- **Reports**: downloadable election report.

#### Settings
Path: Election → **Settings**. Only `root`, `coop_root` and `admin`.

![[Pasted image 20261023160530.png|510]]

How it works:
- Change any option, then **Save Changes**. A confirmation appears: the change **takes effect immediately** on the voting verification process.
- **Reset** puts the form back to what is saved. Both buttons stay disabled until something changes.
- New elections start with the defaults shown below.

##### Vote Eligibility

**![[Pasted image 20261023160614.png]]
Decides which members are allowed to vote.

| Option | Who can vote | Default |
| --- | --- | --- |
| `MIGS` | Every member in the event's member list, registered or not | ✔ |
| `REGISTERED` | Only members who have **registered** (attended) for the event. Others see "Sorry, you are not registered" | |
| `MARKED_CANVOTE` | Only members whose **can vote** flag is on. Others see "you are not authorized to vote" | |

Notes:
- Every member is marked as able to vote by default, and there is currently no screen to change that, so `MARKED_CANVOTE` behaves like `MIGS` for now.
- A member who has **already voted** is always blocked, whatever you choose.

##### Voting Configuration

![[Pasted image 20261023160632.png|244]]
How strict the ballot is for each position. The voter's screen also shows a hint.

| Option        | Rule                                       | Hint on the voter's screen             | Default |
| ------------- | ------------------------------------------ | -------------------------------------- | ------- |
| `ALLOW_SKIP`  | Voter may pick nothing and move on         | "You can skip select"                  | ✔       |
| `ATLEAST_ONE` | At least 1 candidate before **Next**       | "You must select at least 1 candidate" |         |
| `REQUIRE_ALL` | Exactly the position's **Number of Seats** | "You must select N candidates"         |         |

##### Voting Screen Orientation

![[Pasted image 20261023160646.png|229]]
Forces the device orientation for the voting screen. When the device is the wrong way round, an overlay asks the voter to rotate.

| Option | Behavior | Default |
| --- | --- | --- |
| `LANDSCAPE` | Asks to rotate into landscape | ✔ |
| `PORTRAIT` | Asks to rotate into portrait | |
| `ANY` | No restriction | |

##### Others (verification and email)

![[Pasted image 20261023160808.png]]
These switches add layers of proof before a member can vote.

| Switch | What it does | Default |
| --- | --- | --- |
| **Allow Birthday Verification** | Adds the member's **birthday** as a verification layer when voting | Off |
| **Allow OTP Verification** | Adds the member's **vote OTP** as a verification layer when voting. The OTP is sent from the Members tab (**Send all OTP**) | On |
| **Enable Vote Copy Emailing** | After a member votes, the system emails them a copy of their votes, as proof and for transparency. Only sent if the member has a valid email on record | Off |

###### How the verification switches combine
**Voter on their own device**

| OTP | Birthday | What the voter must give |
| --- | --- | --- |
| On | Off | Passbook number and OTP |
| Off | On | Passbook number and birthday |
| On | On | Passbook number and **either** OTP **or** birthday |
| Off | Off | Passbook number only |

A wrong OTP or birthday is rejected ("Invalid OTP" / "Invalid Birthday").

**Assisted voting (an admin authorizes the voter)**
- OTP is checked only if the switch is on **and** the member has an OTP assigned.
- Birthday is checked only if the switch is on **and** the member has a birthday on record.
- A member with no OTP or birthday on record is not blocked by that layer.
- Eligibility is then checked as above.

#### Good to know
- Turning off both verification switches means anyone who knows a passbook number could vote as that member. Only do this when staff are verifying people in person.
- Settings can be changed while the election is live, and the next voter sees the new rules.


## Guides


### Managing an Election

Step by step guide to setting up an election from scratch. For what each screen and setting means, see [Election](#election) and [Manage Event](#manage-event).

#### Step 1. Create an event with type `election`

![[Pasted image 20261023154343.png|663]]
1. Go to [Events](#events) and click **Add Event**.
2. Fill in the title, description, date, address and branch.
3. Set **Category** to `election`.
4. Type the **Election Name**. This field only unlocks when the category is `election`.
5. Add a cover image if you want, then **Save**.

This creates the event and its election together. The election starts as *pending* (shown as "unbegan" in the Events list).

> Category can't be changed to `election` later through Edit Event, so choose it now.

#### Step 2. Import the members (Excel)

![[Pasted image 20261023160939.png|401]]
Open the event with **Manage**. On the **Members** tab, click **csv import** and pick your file.

- Accepted files: `.xlsx`, `.xls`, `.csv`.
- Click **Example Member List Format** in the popup to download a ready-made template.
- Column headers to use:

| Column | Notes |
| --- | --- |
| `passbookNumber` | Required. Each member's unique ID. Duplicates are skipped |
| `firstName` | Required |
| `lastName` | Required |
| `middleName` | Optional |
| `gender` | Optional |
| `birthday` | Needed if you'll use birthday verification |
| `contact` | Optional |
| `emailAddress` | Needed if you'll email vote copies |
| `registered` | Optional |

Tips:
- Clean the file first. Rows with no first and no last name are ignored.
- Only the first sheet in the workbook is read.
- If some rows are skipped (for example duplicate passbook numbers), a list of the skipped members is shown after the import.
- Check the result in the Members table. You can also add a single person with **Add Member**.

Candidates must come from this list, so import members **before** Step 4.

#### Step 3. Define the positions and seats

![[Pasted image 20261023161208.png|415]]
Go to **Election → Positions** and add each position:

- **Position Name**, for example `Chairperson`.
- **Number of Seats**: how many candidates a voter may choose for this position (at least 1). For example, a Board of Directors position with 5 seats lets each voter pick up to 5.

#### Step 4. Create the candidates

![[Pasted image 20261023161713.png|446]]
Go to **Election → Candidates** and click **Add Candidate**:

1. Pick the person from the member list. Search if the list is long.
2. Under **Select a Position**, choose the position they are running for. **Double check this**, since voters will see the candidate under that position.
3. Add a profile picture (optional).
4. Save.

To fix a mistake later, use the row's edit action to change the name, position or picture.

#### Step 5. Configure the election settings

![[Pasted image 20261023161747.png|474]]
Go to **Election → Settings** and set the rules that fit your event:

| Setting | What to choose |
| --- | --- |
| Vote Eligibility | **MIGS** lets every member on your list vote. **REGISTERED** only lets members who registered at the event vote |
| Voting Configuration | **ALLOW_SKIP** lets voters skip a position. **ATLEAST_ONE** makes them pick at least one candidate. **REQUIRE_ALL** makes them fill every seat |
| Voting Screen Orientation | Pick **LANDSCAPE** or **PORTRAIT** to make voters hold their device that way, or **ANY** to allow both |
| Allow OTP Verification | Turn on to make voters enter an OTP code. Send the codes first with **Send all OTP** on the Members tab |
| Allow Birthday Verification | Turn on to make voters enter their birthday. Works only for members who have a birthday on the list |
| Enable Vote Copy Emailing | Turn on to have the system email each voter a copy of their votes, as proof and for transparency. Works only for members who have an email on the list |

Click **Save Changes** and confirm. Details and defaults are in [Election settings](#election).

#### Before and during the election
1. Open registration on the event if members register on the day (see [Open / End Registration](#manage-event)).
2. When everything above is ready, go to **Election → election** and press **start**. It needs at least 1 position and 1 candidate.
3. Follow turnout and results on the **DashBoard**.
4. When voting is finished, press **end**.

How members actually vote, on their own device or with an admin's help, is explained in [Member Voting](#member-voting).


### Member Registration and Attendance

How members register for an event. Registering is also how the system records **attendance**, so there is no separate check-in step. It is separate from voting: a member can register without voting, and the election only looks at registration when **Vote Eligibility** is `REGISTERED` (see [Election settings](#election)).

#### Two ways to register

| | Member registers themselves | Admin or staff registers the member |
| --- | --- | --- |
| Where | The member's own device, on the event's public **Register** page | The **Members** or **Quick Search** tab |
| Verification | Birthday, only if the event requires it | None |
| Recorded as | **Self Registered** | The name of the person who registered them |

#### The settings that control it
These are set in [Event Settings](#manage-event) and with the **Open / End Registration** button at the top of [Manage Event](#manage-event). `root`, `coop_root` and `admin` can change them. `staff` can't open Event Settings or use the Open / End button, but they can register members.

| Setting | Effect on registration |
| --- | --- |
| **Open / End Registration** (Registration Status) | **Closed** (the default): members can't register themselves, and **Register Member** is disabled for admins too. **Open**: registration works |
| **Event registration** | **On Event Date**: members can only register on the day of the event. **Before Event Date**: members can register in advance |
| **Require Birthday Verification (Registration)** | On: a member must enter their birthday to register. Off: no birthday is asked |
| **Default Member Search Mode** | How the member looks themselves up: **By Passbook** or **By Name** |

Registration also stops by itself **after the event date**.

#### What a member sees

##### 1. Open the Register page

![[Pasted image 20261023162050.png|661]]
The member scans the event's **Register QR** (from the QR icon in [Events](#events)), or opens the event's public page and taps **Register**.

The page checks the settings first and may show a message instead:

| Message | Why |
| --- | --- |
| "This event has already passed" | The event date is over |
| "Registration will be open in [date]" | **Event registration** is **On Event Date** and today isn't the event day |
| "Event registration has been closed" | Registration is not open (the Open / End Registration button) |

##### 2. Find yourself


They search by passbook number or by name (`Lastname, Firstname`).
![[Pasted image 20261023162548.png|439]]
The page starts in the **Default Member Search Mode**, and an icon on the search box switches between the two. If several people match, they pick theirs. "Member not found" means they aren't on the member list.
![[Pasted image 20261023162624.png|421]]

##### 3. Check the card
![[Pasted image 20261023162345.png|409]]
The member's card shows their name and passbook number, and their birthday unless birthday verification is required.

- If they are **already registered**, the card shows **REGISTERED** and a **Go Back to Event** button. There is nothing else to do.
- If it isn't them, **Not you? Search member again** takes them back.

##### 4. Enter the birthday (only if required)

When **Require Birthday Verification (Registration)** is on, the member enters their birthday and it must match the record, otherwise they see "Wrong birthday, please try again".

If a member has **no birthday on file**, the check is skipped for them. Import birthdays with the member list if you want this check to work.

##### 5. Register

![[Pasted image 20261023162742.png|390]]
They press **Register**. The page shows **You have been registered 🎉**, their name and passbook number with a **Registered** mark, and the note "Your registration will serve as your attendance".

From there they can **Return to Event**. If the event has an election, they also see **Vote Now** when the election is live, or "voting is not open" when it isn't. How voting works is in [Member Voting](#member-voting).

#### What admins and staff do

##### Register a member

![[Pasted image 20261023162829.png|479]]
1. Open the **Members** tab (or **Quick Search** at a registration desk).
2. Open the ☰ menu on the member and choose **Register Member**. Confirm.
![[Pasted image 20261023162857.png|250]]

The member is marked registered and counted as present. No birthday or OTP is needed.

**Quick Search** is faster at the door: type at least 3 characters of a name, or scan the member's passbook QR, and register them from the result.

##### Undo a registration

![[Pasted image 20261023163002.png|153]]

![[Pasted image 20261023162944.png|184]]
Choose **Unregister** in the same menu. It isn't allowed once the member has **voted**.

Both actions need registration to be **open**, and they are greyed out when it's closed.

##### Check attendance

![[Pasted image 20261023163128.png]]
The **Attendance** tab lists everyone registered, with the time, and a **registered by** column that shows either the staff member's name or **Self Registered**. Use the search, the passbook QR scanner and the column options to find people.

The **Quorum** at the top of the page shows the percentage of members registered (`registered / members`).

#### Typical setups

| Situation | Settings to use |
| --- | --- |
| Members register on arrival at the venue | **Event registration**: On Event Date. Open registration on the day |
| Members pre-register before the event | **Event registration**: Before Event Date. Open registration early, end it when done |
| You want proof it is really the member | Turn on **Require Birthday Verification**, and import birthdays |
| Staff register everyone at a desk | Keep registration open, and use **Quick Search** |
| Only attendees may vote | Open registration, and set **Vote Eligibility** to `REGISTERED` |

#### Good to know
- A member who registered by mistake can be unregistered by an admin or staff, until they have voted.
- Closing registration doesn't remove anyone who has already registered.
- Registered counts feed the quorum, the Attendance tab and the reports.


### Member Voting

How a member casts their vote, and how it changes with the event and election settings. Set the options up first in [Election settings](#election) and [Event Settings](#manage-event).

#### Two ways to vote

| | Member votes on their own | Admin assists the member |
| --- | --- | --- |
| Where | The member's own phone or tablet, on the event's public page | The admin's device, from the **Members** tab |
| Verification | Required, depending on the settings (OTP, birthday, both or none) | **None.** No OTP or birthday is asked |
| Needs | The event's Election QR or link, and the member's passbook number or name | The member to be on the list |
| Still checked | Eligibility, and one vote per member | Eligibility, and one vote per member |

The admin's way is described in [Registering members and assisting votes](#manage-event). The rest of this page follows the member's own way.

#### Before voting can start
- The event must be an `election` event, and the election must be **live** (started from the **election** sub-tab). See [Start and end](#election).
- The election needs positions and candidates.
- The member must be on the event's member list ([import members](#managing-an-election)).
- If verification is on, the member needs their OTP (send them with **Send all OTP**) or a birthday on record.
- If **Vote Eligibility** is `REGISTERED`, the member must have registered at the event first.

#### The member's journey

##### 1. Open the voting page

![[Pasted image 20261023163413.png|667]]
There are two ways in:
- Scan the event's **Election QR** (from the QR icon in [Events](#events)), which goes straight to the voting page.
- Open the event's public page and tap **Vote**. The page also has a **Register** button. **Vote** is greyed out until the election is live.

If the election isn't open, the voting page shows:
- "Election is not yet open" before it starts
- "This election has ended" after it ends

##### 2. Find yourself

The member searches for their record in one of two ways:

| Mode | What to type |
| --- | --- |
| By Passbook | Passbook number |
| By Name | `Lastname, Firstname` |

![[Pasted image 20261023163528.png|330]]![[Pasted image 20261023163552.png|322]]

The page opens in the mode chosen in [Event Settings](#manage-event) (**Default Member Search Mode**). A small icon on the search box switches between the two. If several people match, the member picks theirs from a list. "Member not found" means the name or number isn't on the list.

Note: If recently registered, member account will be already listed and can be clicked to continue as :

![[Pasted image 20261023163652.png|455]]

##### 3. Confirm who you are

The member's card appears with their name, passbook number and, when birthday verification is off, their birthday. A **REGISTERED** or **VOTED** mark shows if it applies.

- If the member **has already voted**, they see "You already voted. Every member is only allowed to vote once." and can only go back to the event page.
- If it isn't them, **Not [name]? Search again** takes them back.

##### 4. Verify

![[Pasted image 20261023163746.png|405]]
What the member sees depends on the **Others** switches in the election settings:

| OTP verification | Birthday verification | What the member does |
| --- | --- | --- |
| On | Off | Enters the **6-character OTP**. It submits by itself when complete |
| Off | On | Enters their **birthday** |
| On | On | Starts with the birthday, and can tap **Use OTP Code instead** (or **Use Birthday instead**) to switch |
| Off | Off | Sees "No extra verification required" and just presses the button |

Then they press **Verify & Open Ballot**.

If something is wrong they see **Verification Failed** with the reason:

| Message | Meaning |
| --- | --- |
| Invalid OTP | The code is wrong |
| Invalid Birthday | The birthday doesn't match the record |
| Sorry, you are not registered | **Vote Eligibility** is `REGISTERED` and the member hasn't registered |
| Sorry, you are not authorized to vote | **Vote Eligibility** is `MARKED_CANVOTE` and the member isn't allowed |
| You already voted | The member has voted before |

With `MIGS` eligibility, any member on the list can pass, registered or not.

##### 5. Fill in the ballot
![[Pasted image 20261023164256.png|692]]
The ballot shows **one position at a time**.

- The header shows the position and how many selections are left (for example "2 Selection left").
- Tap a candidate to choose them, and tap again to unchoose. Once the position's **seats** are full, the other candidates are greyed out until one is unchosen.
- Use the arrows at the bottom to go back or forward.

The hint under the header and the **Next** arrow follow **Voting Configuration**:

| Setting | Hint shown | Can the member go next? |
| --- | --- | --- |
| `ALLOW_SKIP` | "You can skip select" | Always, even with nothing chosen |
| `ATLEAST_ONE` | "You must select at least 1 candidate" | Only after choosing at least 1 |
| `REQUIRE_ALL` | "You must select N candidate(s)" | Only after choosing exactly the position's seats |

If **Voting Screen Orientation** is `LANDSCAPE` or `PORTRAIT`, a message asks the member to rotate their device until it matches.

##### 6. Review and cast

![[Pasted image 20261023164330.png|700]]
After the last position comes **Your Vote Summary**, listing the choices for every position. The page asks the member to review carefully and take a screenshot first.

1. Press **Cast Vote**. A confirmation appears with **Review Vote** and **Cast Vote**.
2. Confirm. The vote is saved and can't be changed.
3. The page shows **Voted**, with a **Download Summary Copy** button and **Return to Event**.

![[Pasted image 20261023164543.png|526]]

If **Enable Vote Copy Emailing** is on and the member has an email on record, the system also emails them a copy of their vote, as proof and for transparency.

The member is now marked **Voted**, which also counts towards the [Dashboard](#election) and the quorum.

#### What admins control

| You want to… | Change this |
| --- | --- |
| Make voters prove who they are | **Allow OTP Verification** and **Allow Birthday Verification** |
| Restrict who can vote | **Vote Eligibility** |
| Make voters pick someone, or fill every seat | **Voting Configuration** |
| Fix the device orientation | **Voting Screen Orientation** |
| Send voters a copy of their vote | **Enable Vote Copy Emailing** |
| Make it easier to find members | **Default Member Search Mode** (Event Settings) |

Changes apply immediately. The next voter sees the new rules.

#### Good to know
- Voting happens in the member's own browser. If they close it before casting, they can start again, but a vote that was already cast can't be redone.
- A member can only vote once, whichever way they vote.
- If a member can't verify (no OTP, no birthday on record), use **Assist Vote** from the Members tab.


### Managing Incentives

Incentives are the items given away at an event, such as a gift, a meal or a giveaway. This page explains how to set them up, hand them out and report on them. You find all of it in the **Incentive** tab of [Manage Event](#manage-event).

#### The idea in short
1. An admin creates the **incentive items** and decides what a member must have done to claim each one.
2. The admin **assigns** each item to the staff or admins who will hand it out, with a quantity.
3. Members **claim** the items, either by themselves online or with a staff member helping.
4. Staff **release** the item to the member.
5. Everyone can follow progress in the **claims list** and the **reports**.

#### Who can use what

| Sub-tab           | root | coop_root | admin | staff |
| ----------------- | :--: | :-------: | :---: | :---: |
| Incentives        |  ✔   |           |   ✔   |       |
| Assignees         |  ✔   |           |   ✔   |   ✔   |
| Claims Masterlist |  ✔   |           |   ✔   |   ✔   |
| Claim Reports     |  ✔   |     ✔     |   ✔   |   ✔   |

Notes:
- The Incentive tab always opens on **Incentives** first. If your role can't use it (for example `staff`), you'll see a "not allowed" message. Just click another sub-tab such as **Assignees**.
- `staff` only see their own assignments, and the claims for the items assigned to them.

#### Step 1. Create the incentive items

![[Pasted image 20261023164716.png|456]]
Sub-tab **Incentives** (`root` and `admin`).

Click **Add Item** and fill in:

| Field | What to enter |
| --- | --- |
| Item Name | What you are giving away (at least 2 characters) |
| Claim Requirement | What a member must have done before they can claim it (see below) |

##### Claim requirements

![[Pasted image 20261023164730.png|422]]

| Requirement | The member can claim when… |
| --- | --- |
| `REGISTERED` | They have registered for the event |
| `VOTED` | They have voted |
| `REGISTERED_VOTED` | They have registered **and** voted |
| `REGISTERED_SURVEYED` | They have registered **and** been marked as surveyed (see **Surveyed** in the [Members row actions](#manage-event)) |

If a member doesn't meet the requirement, the item shows in red with "NOT" and the requirement, and it can't be claimed.

##### The Incentives table

![[Pasted image 20261023164757.png|465]]
Shows every item, with search, column options and refresh.

| Column | Meaning |
| --- | --- |
| Item Name | The item |
| Claim Requirement | What is needed to claim it |
| Assigned Staff | How many people the item is assigned to |
| Total Claimed | How many members have claimed it |

##### Row actions
![[Pasted image 20261023164816.png|294]]

| Action | What it does |
| --- | --- |
| Copy Incentive ID | Copies the ID |
| **Edit Incentive** | Change the name or the claim requirement |
| **Assign** | Assign the item to a staff or admin (Step 2) |
| **Delete Incentive** | Removes the item |

> An item that already has claims **can't be deleted**. Delete it before the event starts if you need to.

#### Step 2. Assign the items to staff

![[Pasted image 20261023164905.png|351]]
Assigning decides **who hands out which item**, and how many they carry.

1. On the **Incentives** sub-tab, open the ☰ menu on an item and choose **Assign**.
2. Pick the person under **Assign To**. You can search by name. You can assign people from the event's branch.
3. Enter the **Quantity** they are given.
4. Save.

A person can be assigned to the same item only **once**. To change the number later, edit their assignment (below).

##### The Assignees sub-tab

![[Pasted image 20261023164937.png|700]]
Lists every assignment (`staff` see only their own).

| Column | Meaning |
| --- | --- |
| Incentive Item | The item |
| Assigned User | Who hands it out |
| Assigned Quantity | How many they were given |
| Assisted Claims | How many claims they have released |

Use the **Assigned to** filter to show one person, or **You** to show your own. Row actions:
- **Edit quantity**: change the number given to that person.
- **Revoke** (delete): remove the assignment.

> The quantity is a record of what each person was handed. The system does **not** stop a claim when the quantity runs out, so keep an eye on the **Total Onhand** line in the reports.

#### Step 3. Members claim their items
There are two ways. Both only work for items that are assigned to someone.

##### A. The member claims online

![[Pasted image 20261023165530.png|479]]

1. The member opens the event's public page and chooses **Claim event incentives/giveaways**.
2. They enter their **passbook number**, then verify with their **OTP** or their **birthday** (the birthday option only works if one is on record).
![[Pasted image 20261023165509.png|378]]
3. They see the items. Items they qualify for can be tapped to claim. Items already claimed show as claimed.
![[Pasted image 20261023165427.png|338]]

An online claim is marked **Pending Release** until a staff member hands over the item (Step 4).

##### B. A staff member helps at the desk

![[Pasted image 20261023165153.png|347]]
1. In the **Members** tab (or Quick Search), open the ☰ menu on the member and choose **Incentive Claims**.
2. The **Incentive Claim Sheet** opens. Under **Assigned to you** are the items assigned to you that the member hasn't claimed yet. Items the member doesn't qualify for are shown in red and can't be picked.
3. Tap the items to give, then press **save claim**.
4. Items already claimed by the member show under **Claimed**.

Claims made this way are released immediately.

#### Step 4. Release online claims
Sub-tab **Claims Masterlist**. An online claim waits here as **Pending Release**.

1. Find the claim.
2. Click **Pending Release**, confirm, and hand the item to the member.
3. The claim now shows **Released**, with your name under **Assisted By**.

Only someone **assigned to that item** can release it. Anyone else is told they can't.

##### The Claims Masterlist

| Column | Meaning |
| --- | --- |
| Status | **Released** or **Pending Release** |
| Claim ID, Item Name | The claim and its item |
| Passbook Number, First Name, Last Name | The member |
| Assisted By | The staff who released it |
| Claimed Mode | **Claimed Online** or **Staff Assistance** |
| Claimed Date / Released Date | When it was claimed and handed over |

Filter by **Claim Mode**, **Assisted by** and **Status**. Use **Delete** on a row to remove a claim entry, for example one made by mistake. The member can then claim that item again.

#### Step 5. Check the reports

Sub-tab **Claim Reports**. It shows one block per staff or admin:

![[Pasted image 20261023165632.png]]

- Their name and **Total Assist** (how many claims they handled).
- A list of the members they served, with a mark under each item they gave.
- **Total Issued**: how many of each item they have given out.
- **Total Assigned**: how many of each item they were given.
- **Total Onhand**: what is left (assigned minus issued). Items not assigned to that person show "not assigned".

Buttons:
- **Refresh** reloads the report.
- **Filter** (`root`, `coop_root`, `admin`) picks **Yours**, **All Users**, or specific people.
- **Export** downloads the report as an Excel file.

The report opens on **your own** block by default. `staff` can only see their own report.

#### Good to know
- Online claims need the member's **OTP** or **birthday**, so send OTPs from the Members tab first (see [Members](#manage-event)).
- The claim requirement is checked against the member's current status, so register or survey members **before** they try to claim.
- Assign items **before** the event. Members can only see and claim items that are assigned to someone.

