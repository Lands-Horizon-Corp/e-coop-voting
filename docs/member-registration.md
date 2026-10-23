# Member Registration and Attendance

How members register for an event. Registering is also how the system records **attendance**, so there is no separate check-in step. It is separate from voting: a member can register without voting, and the election only looks at registration when **Vote Eligibility** is `REGISTERED` (see [[election#Settings|Election settings]]).

## Two ways to register

| | Member registers themselves | Admin or staff registers the member |
| --- | --- | --- |
| Where | The member's own device, on the event's public **Register** page | The **Members** or **Quick Search** tab |
| Verification | Birthday, only if the event requires it | None |
| Recorded as | **Self Registered** | The name of the person who registered them |

## The settings that control it
These are set in [[manage-event#Event Settings|Event Settings]] and with the **Open / End Registration** button at the top of [[manage-event|Manage Event]]. `root`, `coop_root` and `admin` can change them. `staff` can't open Event Settings or use the Open / End button, but they can register members.

| Setting | Effect on registration |
| --- | --- |
| **Open / End Registration** (Registration Status) | **Closed** (the default): members can't register themselves, and **Register Member** is disabled for admins too. **Open**: registration works |
| **Event registration** | **On Event Date**: members can only register on the day of the event. **Before Event Date**: members can register in advance |
| **Require Birthday Verification (Registration)** | On: a member must enter their birthday to register. Off: no birthday is asked |
| **Default Member Search Mode** | How the member looks themselves up: **By Passbook** or **By Name** |

Registration also stops by itself **after the event date**.

## What a member sees

### 1. Open the Register page

**ADD IMAGE HERE - Screenshot of the public Register page**
The member scans the event's **Register QR** (from the QR icon in [[page-events|Events]]), or opens the event's public page and taps **Register**.

The page checks the settings first and may show a message instead:

| Message | Why |
| --- | --- |
| "This event has already passed" | The event date is over |
| "Registration will be open in [date]" | **Event registration** is **On Event Date** and today isn't the event day |
| "Event registration has been closed" | Registration is not open (the Open / End Registration button) |

### 2. Find yourself

**ADD IMAGE HERE - Screenshot of the member search results**
They search by passbook number or by name (`Lastname, Firstname`). The page starts in the **Default Member Search Mode**, and an icon on the search box switches between the two. If several people match, they pick theirs. "Member not found" means they aren't on the member list.

### 3. Check the card

**ADD IMAGE HERE - Screenshot of the member card shown before registering**
The member's card shows their name and passbook number, and their birthday unless birthday verification is required.

- If they are **already registered**, the card shows **REGISTERED** and a **Go Back to Event** button. There is nothing else to do.
- If it isn't them, **Not you? Search member again** takes them back.

### 4. Enter the birthday (only if required)

**ADD IMAGE HERE - Screenshot of the birthday entry step**
When **Require Birthday Verification (Registration)** is on, the member enters their birthday and it must match the record, otherwise they see "Wrong birthday, please try again".

If a member has **no birthday on file**, the check is skipped for them. Import birthdays with the member list if you want this check to work.

### 5. Register

**ADD IMAGE HERE - Screenshot of the registration confirmation screen**
They press **Register**. The page shows **You have been registered 🎉**, their name and passbook number with a **Registered** mark, and the note "Your registration will serve as your attendance".

From there they can **Return to Event**. If the event has an election, they also see **Vote Now** when the election is live, or "voting is not open" when it isn't. How voting works is in [[member-voting]].

## What admins and staff do

### Register a member

**ADD IMAGE HERE - Screenshot of an admin registering a member from the Members table**
1. Open the **Members** tab (or **Quick Search** at a registration desk).
2. Open the ☰ menu on the member and choose **Register Member**. Confirm.

The member is marked registered and counted as present. No birthday or OTP is needed.

**Quick Search** is faster at the door: type at least 3 characters of a name, or scan the member's passbook QR, and register them from the result.

### Undo a registration

**ADD IMAGE HERE - Screenshot of the unregister option on a member row**
Choose **Unregister** in the same menu. It isn't allowed once the member has **voted**.

Both actions need registration to be **open**, and they are greyed out when it's closed.

### Check attendance

**ADD IMAGE HERE - Screenshot of the Attendance tab with registered members**
The **Attendance** tab lists everyone registered, with the time, and a **registered by** column that shows either the staff member's name or **Self Registered**. Use the search, the passbook QR scanner and the column options to find people.

The **Quorum** at the top of the page shows the percentage of members registered (`registered / members`).

## Typical setups

| Situation | Settings to use |
| --- | --- |
| Members register on arrival at the venue | **Event registration**: On Event Date. Open registration on the day |
| Members pre-register before the event | **Event registration**: Before Event Date. Open registration early, end it when done |
| You want proof it is really the member | Turn on **Require Birthday Verification**, and import birthdays |
| Staff register everyone at a desk | Keep registration open, and use **Quick Search** |
| Only attendees may vote | Open registration, and set **Vote Eligibility** to `REGISTERED` |

## Good to know
- A member who registered by mistake can be unregistered by an admin or staff, until they have voted.
- Closing registration doesn't remove anyone who has already registered.
- Registered counts feed the quorum, the Attendance tab and the reports.
