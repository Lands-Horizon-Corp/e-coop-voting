# Member Voting

How a member casts their vote, and how it changes with the event and election settings. Set the options up first in [[election#Settings|Election settings]] and [[manage-event#Event Settings|Event Settings]].

## Two ways to vote

| | Member votes on their own | Admin assists the member |
| --- | --- | --- |
| Where | The member's own phone or tablet, on the event's public page | The admin's device, from the **Members** tab |
| Verification | Required, depending on the settings (OTP, birthday, both or none) | **None.** No OTP or birthday is asked |
| Needs | The event's Election QR or link, and the member's passbook number or name | The member to be on the list |
| Still checked | Eligibility, and one vote per member | Eligibility, and one vote per member |

The admin's way is described in [[manage-event#Registering members and assisting votes|Registering members and assisting votes]]. The rest of this page follows the member's own way.

## Before voting can start
- The event must be an `election` event, and the election must be **live** (started from the **election** sub-tab). See [[election#Start and end|Start and end]].
- The election needs positions and candidates.
- The member must be on the event's member list ([[managing-an-election#Step 2. Import the members (Excel)|import members]]).
- If verification is on, the member needs their OTP (send them with **Send all OTP**) or a birthday on record.
- If **Vote Eligibility** is `REGISTERED`, the member must have registered at the event first.

## The member's journey

### 1. Open the voting page

**ADD IMAGE HERE - Screenshot of the public voting page**
There are two ways in:
- Scan the event's **Election QR** (from the QR icon in [[page-events|Events]]), which goes straight to the voting page.
- Open the event's public page and tap **Vote**. The page also has a **Register** button. **Vote** is greyed out until the election is live.

If the election isn't open, the voting page shows:
- "Election is not yet open" before it starts
- "This election has ended" after it ends

### 2. Find yourself

**ADD IMAGE HERE - Screenshot of the member search on the voting page**
The member searches for their record in one of two ways:

| Mode | What to type |
| --- | --- |
| By Passbook | Passbook number |
| By Name | `Lastname, Firstname` |

The page opens in the mode chosen in [[manage-event#Event Settings|Event Settings]] (**Default Member Search Mode**). A small icon on the search box switches between the two. If several people match, the member picks theirs from a list. "Member not found" means the name or number isn't on the list.

### 3. Confirm who you are

**ADD IMAGE HERE - Screenshot of the confirm identity step**
The member's card appears with their name, passbook number and, when birthday verification is off, their birthday. A **REGISTERED** or **VOTED** mark shows if it applies.

- If the member **has already voted**, they see "You already voted. Every member is only allowed to vote once." and can only go back to the event page.
- If it isn't them, **Not [name]? Search again** takes them back.

### 4. Verify

**ADD IMAGE HERE - Screenshot of the OTP or birthday verification step**
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

### 5. Fill in the ballot

**ADD IMAGE HERE - Screenshot of the ballot with positions and candidates**
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

### 6. Review and cast

**ADD IMAGE HERE - Screenshot of the review screen before casting the vote**
After the last position comes **Your Vote Summary**, listing the choices for every position. The page asks the member to review carefully and take a screenshot first.

1. Press **Cast Vote**. A confirmation appears with **Review Vote** and **Cast Vote**.
2. Confirm. The vote is saved and can't be changed.
3. The page shows **Voted**, with a **Download Summary Copy** button and **Return to Event**.

If **Enable Vote Copy Emailing** is on and the member has an email on record, the system also emails them a copy of their vote, as proof and for transparency.

The member is now marked **Voted**, which also counts towards the [[election#Dashboard|Dashboard]] and the quorum.

## What admins control

| You want to… | Change this |
| --- | --- |
| Make voters prove who they are | **Allow OTP Verification** and **Allow Birthday Verification** |
| Restrict who can vote | **Vote Eligibility** |
| Make voters pick someone, or fill every seat | **Voting Configuration** |
| Fix the device orientation | **Voting Screen Orientation** |
| Send voters a copy of their vote | **Enable Vote Copy Emailing** |
| Make it easier to find members | **Default Member Search Mode** (Event Settings) |

Changes apply immediately. The next voter sees the new rules.

## Good to know
- Voting happens in the member's own browser. If they close it before casting, they can start again, but a vote that was already cast can't be redone.
- A member can only vote once, whichever way they vote.
- If a member can't verify (no OTP, no birthday on record), use **Assist Vote** from the Members tab.
