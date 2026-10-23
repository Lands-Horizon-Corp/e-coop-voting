# Managing an Election

Step by step guide to setting up an election from scratch. For what each screen and setting means, see [[election|Election]] and [[manage-event|Manage Event]].

## Step 1. Create an event with type `election`

**ADD IMAGE HERE - Screenshot of the create event form with the election type chosen**
1. Go to [[page-events|Events]] and click **Add Event**.
2. Fill in the title, description, date, address and branch.
3. Set **Category** to `election`.
4. Type the **Election Name**. This field only unlocks when the category is `election`.
5. Add a cover image if you want, then **Save**.

This creates the event and its election together. The election starts as *pending* (shown as "unbegan" in the Events list).

> Category can't be changed to `election` later through Edit Event, so choose it now.

## Step 2. Import the members (Excel)

**ADD IMAGE HERE - Screenshot of the import members dialog with a file selected**
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

## Step 3. Define the positions and seats

**ADD IMAGE HERE - Screenshot of the add position form**
Go to **Election → Positions** and add each position:

- **Position Name**, for example `Chairperson`.
- **Number of Seats**: how many candidates a voter may choose for this position (at least 1). For example, a Board of Directors position with 5 seats lets each voter pick up to 5.

## Step 4. Create the candidates

**ADD IMAGE HERE - Screenshot of the add candidate form**
Go to **Election → Candidates** and click **Add Candidate**:

1. Pick the person from the member list. Search if the list is long.
2. Under **Select a Position**, choose the position they are running for. **Double check this**, since voters will see the candidate under that position.
3. Add a profile picture (optional).
4. Save.

To fix a mistake later, use the row's edit action to change the name, position or picture.

## Step 5. Configure the election settings

**ADD IMAGE HERE - Screenshot of the Settings sub-tab**
Go to **Election → Settings** and set the rules that fit your event:

| Setting | What to choose |
| --- | --- |
| Vote Eligibility | **MIGS** lets every member on your list vote. **REGISTERED** only lets members who registered at the event vote |
| Voting Configuration | **ALLOW_SKIP** lets voters skip a position. **ATLEAST_ONE** makes them pick at least one candidate. **REQUIRE_ALL** makes them fill every seat |
| Voting Screen Orientation | Pick **LANDSCAPE** or **PORTRAIT** to make voters hold their device that way, or **ANY** to allow both |
| Allow OTP Verification | Turn on to make voters enter an OTP code. Send the codes first with **Send all OTP** on the Members tab |
| Allow Birthday Verification | Turn on to make voters enter their birthday. Works only for members who have a birthday on the list |
| Enable Vote Copy Emailing | Turn on to have the system email each voter a copy of their votes, as proof and for transparency. Works only for members who have an email on the list |

Click **Save Changes** and confirm. Details and defaults are in [[election#Settings|Election settings]].

## Before and during the election
1. Open registration on the event if members register on the day (see [[manage-event#Open / End Registration|Open / End Registration]]).
2. When everything above is ready, go to **Election → election** and press **start**. It needs at least 1 position and 1 candidate.
3. Follow turnout and results on the **DashBoard**.
4. When voting is finished, press **end**.

How members actually vote, on their own device or with an admin's help, is explained in [[member-voting]].
