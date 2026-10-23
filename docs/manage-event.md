# Manage Event

This is where you run a single event: its members, check-in, incentives and election. Open it from [[page-events|Events]] by clicking **Manage** (or **Manage Election**) on the event's row.

## Top of the page

**ADD IMAGE HERE - Screenshot of the event bar showing title, location, date and the registration progress**

| Part | What it shows |
| --- | --- |
| Event bar | The event's title, location and date |
| Quorum | The share of members who have registered, and the count (for example `0 / 0 members`) |
| **Open Registration** / **End Registration** button | Turns registration on or off, see [[#Open / End Registration]] |
| Back | Returns to the Events list |

## Open / End Registration

**ADD IMAGE HERE - Screenshot of the registration button in both states (End Registration and Open Registration)**
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
- Even with registration open, members can't register after the event date. Whether they can register **before** the event day depends on **Event registration** in [[#Event Settings]].

## Tabs

**ADD IMAGE HERE - Screenshot of the row of tabs on the Manage Event page**

| Tab | What it's for | Who sees it |
| --- | --- | --- |
| [[#Members]] | The event's member list | Everyone |
| [[#Quick Search]] | Find one member fast, at the registration desk | Everyone |
| [[#Attendance]] | Who has registered / attended | Everyone |
| [[#Incentive]] | Items given out at the event and who claimed them | Everyone |
| [[#Event Settings]] | Event details and registration rules | Everyone except `staff` |
| [[#Election]] | Positions, candidates, settings and results | Everyone except `staff`, and only if the event is an election |

## Members
The list of people who can take part in this event. Everything else (registration, voting, incentives) works from this list.

### Toolbar

**ADD IMAGE HERE - Screenshot of the Members toolbar with its buttons**

| Button | What it does |
| --- | --- |
| Search box | Filters the list as you type |
| Scan icon | Scans a member's passbook QR to find them |
| **View** | Shows or hides columns |
| Refresh | Reloads the list |
| **Add Member** | Adds one member by hand |
| **Export PB QR** | Exports the passbook QR codes for many members at once |
| **Send all OTP** | Sends each member their voting OTP |
| **csv import** | Adds many members at once from an Excel or CSV file (steps in [[managing-an-election#Step 2. Import the members (Excel)]]) |

### Columns

**ADD IMAGE HERE - Screenshot of the Members table with all columns visible**

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

### Row actions

**ADD IMAGE HERE - Screenshot of the row actions menu open on one member**
Click the ☰ menu on a member:

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

### Registering members and assisting votes

**ADD IMAGE HERE - Screenshot of the member row menu with Register and Assist Vote**
The Members tab is also where an admin helps members at the event. Open the ☰ menu on a member:

| Action | What it does |
| --- | --- |
| **Register Member** | Marks the member as registered. This also counts as their **attendance**. **Unregister** undoes it. Needs [[#Open / End Registration|registration to be open]], and a member who has voted can't be unregistered |
| **Assist Vote** | Opens the voting screen for that member in a **new browser tab**, already signed in with the member's credentials. **No OTP or birthday is asked.** Only for election events, and only for members who haven't voted |

Assisted voting:
- The election must be **live**.
- It still follows **Vote Eligibility**. With `REGISTERED`, register the member first.
- The ballot, the rules (**Voting Configuration**, seats) and the vote summary are the same as for any member.
- Use it for members without a phone, or who can't verify (no OTP or birthday on record).

If the member prefers to use **their own device**, they don't need you. They open the event's public page, search for themselves, verify with an OTP or birthday if the election requires it, and vote. The whole flow is in [[member-voting]].

## Quick Search

**ADD IMAGE HERE - Screenshot of the Quick Search screen with a member found**
A fast lookup for the registration desk. Type at least 3 characters of a name, or scan a member's QR code, and up to 10 matching members appear. You get the same row actions as in the Members tab, so you can register someone right away.

## Attendance

**ADD IMAGE HERE - Screenshot of the Attendance tab**
The full registration flow, for members and for admins, is in [[member-registration]].

Shows the members who have **registered**, who registered them and when. Use it to check who is present. It has a search box, a passbook QR scanner, a refresh button and column options.

## Incentive

**ADD IMAGE HERE - Screenshot of the Incentive tab**
For anything you give members at the event (for example a gift or a meal). Full guide: [[managing-incentives]]. It has four sub-tabs:

| Sub-tab | What it's for |
| --- | --- |
| Incentives | Create and manage the incentive items |
| Assignees | Choose who hands out each incentive, and how many |
| Claims Masterlist | The list of members' claims |
| Claim Reports | Reports on claims, with filters |

## Event Settings

**ADD IMAGE HERE - Screenshot of the Event Settings tab**
Change the event's details and its registration rules. Not available to `staff`.

| Setting                                         | What it does                                                                                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Title, date, location, description, cover image | The event's basic details                                                                                                                              |
| Registration Status                             | Start or end registration (the same switch as the button at the top)                                                                                   |
| Event registration                              | **On Event Date**: members can register only on the event day. **Before Event Date**: members can register in advance                                  |
| Require Birthday Verification (Registration)    | Members must give their birthday to register. Registration without a birthday is not allowed                                                           |
| Default Member Search Mode                      | How members are looked up when registering. **By Passbook** searches by passbook number. **By Name** searches by name written as `Lastname, Firstname` |

## Election
Only for events created with the category `election`, and not shown to `staff`. It has five sub-tabs: DashBoard, election (overview, with start and end), Candidates, Positions and Settings. See [[election|Election]] for each one, and [[managing-an-election]] for the step by step setup.
