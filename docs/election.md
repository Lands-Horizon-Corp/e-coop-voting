# Election

The **Election** tab of [[manage-event|Manage Event]]. It only exists for events created with category `election`, and it is hidden from `staff`. `root`, `coop_root` and `admin` can open it.

## Suggested order
1. Create the **Positions** (what people vote for).
2. Add **Candidates** to those positions.
3. Review the **Settings** (who can vote, how they are verified, how the ballot behaves).
4. On the **election** overview, press **start**.
5. Watch the **Dashboard** while voting runs, then press **end**.

## Sub-tabs

**ADD IMAGE HERE - Screenshot of the Election tab with its five sub-tabs**

| Sub-tab | Purpose |
| --- | --- |
| **DashBoard** | Opens first. Live quorum, results and graphs, and downloadable reports |
| **election** | Overview: election details, its candidates and positions, and the **start / end** buttons |
| **Candidates** | Add, edit and remove candidates |
| **Positions** | Add, edit and remove positions |
| **Settings** | Voting rules and verification (see below) |

### Start and end

**ADD IMAGE HERE - Screenshot of the Start and end sub-tab, with the start button**
On the **election** sub-tab (not shown to `staff`):
- **start** makes the election **live** so members can vote. It's disabled until the election has at least **1 position and 1 candidate**. You can still edit the election while it is live.
- **end** closes it (status **ended**). The confirmation warns that incoming votes won't be kept after that.
- Status on the Events list: *unbegan* (pending), *live*, *ended*.

### Positions

**ADD IMAGE HERE - Screenshot of the Positions sub-tab with a few positions listed**
Each position has:
- **Position Name**
- **Number of Seats**: how many candidates a voter may pick for it (at least 1).

### Candidates

**ADD IMAGE HERE - Screenshot of the Candidates sub-tab with a few candidates listed**
- A candidate must be someone from the event's **member list**. Adding a passbook number that isn't in the list is rejected.
- Each candidate has a first and last name, a passbook number, a position and a profile picture.

### Dashboard

**ADD IMAGE HERE - Screenshot of the Dashboard sub-tab with live results**
- **Quorum**: share of members who have voted.
- **Results & Graphs**: bar and pie charts per position.
- **Reports**: downloadable election report.

## Settings
Path: Election → **Settings**. Only `root`, `coop_root` and `admin`.

How it works:
- Change any option, then **Save Changes**. A confirmation appears: the change **takes effect immediately** on the voting verification process.
- **Reset** puts the form back to what is saved. Both buttons stay disabled until something changes.
- New elections start with the defaults shown below.

### Vote Eligibility

**ADD IMAGE HERE - Screenshot of the Vote Eligibility setting and its options**
Decides which members are allowed to vote.

| Option | Who can vote | Default |
| --- | --- | --- |
| `MIGS` | Every member in the event's member list, registered or not | ✔ |
| `REGISTERED` | Only members who have **registered** (attended) for the event. Others see "Sorry, you are not registered" | |
| `MARKED_CANVOTE` | Only members whose **can vote** flag is on. Others see "you are not authorized to vote" | |

Notes:
- Every member is marked as able to vote by default, and there is currently no screen to change that, so `MARKED_CANVOTE` behaves like `MIGS` for now.
- A member who has **already voted** is always blocked, whatever you choose.

### Voting Configuration

**ADD IMAGE HERE - Screenshot of the Voting Configuration setting and its options**
How strict the ballot is for each position. The voter's screen also shows a hint.

| Option | Rule | Hint on the voter's screen | Default |
| --- | --- | --- | --- |
| `ALLOW_SKIP` | Voter may pick nothing and move on | "You can skip select" | ✔ |
| `ATLEAST_ONE` | At least 1 candidate before **Next** | "You must select at least 1 candidate" | |
| `REQUIRE_ALL` | Exactly the position's **Number of Seats** | "You must select N candidates" | |

### Voting Screen Orientation

**ADD IMAGE HERE - Screenshot of the Voting Screen Orientation setting and its options**
Forces the device orientation for the voting screen. When the device is the wrong way round, an overlay asks the voter to rotate.

| Option | Behavior | Default |
| --- | --- | --- |
| `LANDSCAPE` | Asks to rotate into landscape | ✔ |
| `PORTRAIT` | Asks to rotate into portrait | |
| `ANY` | No restriction | |

### Others (verification and email)

**ADD IMAGE HERE - Screenshot of the OTP, birthday and vote copy email switches**
These switches add layers of proof before a member can vote.

| Switch | What it does | Default |
| --- | --- | --- |
| **Allow Birthday Verification** | Adds the member's **birthday** as a verification layer when voting | Off |
| **Allow OTP Verification** | Adds the member's **vote OTP** as a verification layer when voting. The OTP is sent from the Members tab (**Send all OTP**) | On |
| **Enable Vote Copy Emailing** | After a member votes, the system emails them a copy of their votes, as proof and for transparency. Only sent if the member has a valid email on record | Off |

#### How the verification switches combine
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

## Good to know
- Turning off both verification switches means anyone who knows a passbook number could vote as that member. Only do this when staff are verifying people in person.
- Settings can be changed while the election is live, and the next voter sees the new rules.
