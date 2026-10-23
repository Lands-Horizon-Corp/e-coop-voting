# Managing Incentives

Incentives are the items given away at an event, such as a gift, a meal or a giveaway. This page explains how to set them up, hand them out and report on them. You find all of it in the **Incentive** tab of [[manage-event|Manage Event]].

## The idea in short
1. An admin creates the **incentive items** and decides what a member must have done to claim each one.
2. The admin **assigns** each item to the staff or admins who will hand it out, with a quantity.
3. Members **claim** the items, either by themselves online or with a staff member helping.
4. Staff **release** the item to the member.
5. Everyone can follow progress in the **claims list** and the **reports**.

## Who can use what

| Sub-tab           | root | coop_root | admin | staff |
| ----------------- | :--: | :-------: | :---: | :---: |
| Incentives        |  ✔   |           |   ✔   |       |
| Assignees         |  ✔   |           |   ✔   |   ✔   |
| Claims Masterlist |  ✔   |           |   ✔   |   ✔   |
| Claim Reports     |  ✔   |     ✔     |   ✔   |   ✔   |

Notes:
- The Incentive tab always opens on **Incentives** first. If your role can't use it (for example `staff`), you'll see a "not allowed" message. Just click another sub-tab such as **Assignees**.
- `staff` only see their own assignments, and the claims for the items assigned to them.

## Step 1. Create the incentive items

**ADD IMAGE HERE - Screenshot of the create incentive item form**
Sub-tab **Incentives** (`root` and `admin`).

Click **Add Item** and fill in:

| Field | What to enter |
| --- | --- |
| Item Name | What you are giving away (at least 2 characters) |
| Claim Requirement | What a member must have done before they can claim it (see below) |

### Claim requirements

**ADD IMAGE HERE - Screenshot of the claim requirement options in the item form**

| Requirement | The member can claim when… |
| --- | --- |
| `REGISTERED` | They have registered for the event |
| `VOTED` | They have voted |
| `REGISTERED_VOTED` | They have registered **and** voted |
| `REGISTERED_SURVEYED` | They have registered **and** been marked as surveyed (see **Surveyed** in the [[manage-event#Row actions|Members row actions]]) |

If a member doesn't meet the requirement, the item shows in red with "NOT" and the requirement, and it can't be claimed.

### The Incentives table

**ADD IMAGE HERE - Screenshot of the Incentives table with a few items**
Shows every item, with search, column options and refresh.

| Column | Meaning |
| --- | --- |
| Item Name | The item |
| Claim Requirement | What is needed to claim it |
| Assigned Staff | How many people the item is assigned to |
| Total Claimed | How many members have claimed it |

### Row actions

| Action | What it does |
| --- | --- |
| Copy Incentive ID | Copies the ID |
| **Edit Incentive** | Change the name or the claim requirement |
| **Assign** | Assign the item to a staff or admin (Step 2) |
| **Delete Incentive** | Removes the item |

> An item that already has claims **can't be deleted**. Delete it before the event starts if you need to.

## Step 2. Assign the items to staff

**ADD IMAGE HERE - Screenshot of the assign dialog with a staff member chosen**
Assigning decides **who hands out which item**, and how many they carry.

1. On the **Incentives** sub-tab, open the ☰ menu on an item and choose **Assign**.
2. Pick the person under **Assign To**. You can search by name. You can assign people from the event's branch.
3. Enter the **Quantity** they are given.
4. Save.

A person can be assigned to the same item only **once**. To change the number later, edit their assignment (below).

### The Assignees sub-tab

**ADD IMAGE HERE - Screenshot of the Assignees sub-tab**
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

## Step 3. Members claim their items
There are two ways. Both only work for items that are assigned to someone.

### A. The member claims online

**ADD IMAGE HERE - Screenshot of the member's online claim screen**
1. The member opens the event's public page and chooses **Claim event incentives/giveaways**.
2. They enter their **passbook number**, then verify with their **OTP** or their **birthday** (the birthday option only works if one is on record).
3. They see the items. Items they qualify for can be tapped to claim. Items already claimed show as claimed.

An online claim is marked **Pending Release** until a staff member hands over the item (Step 4).

### B. A staff member helps at the desk

**ADD IMAGE HERE - Screenshot of the staff desk claim screen**
1. In the **Members** tab (or Quick Search), open the ☰ menu on the member and choose **Incentive Claims**.
2. The **Incentive Claim Sheet** opens. Under **Assigned to you** are the items assigned to you that the member hasn't claimed yet. Items the member doesn't qualify for are shown in red and can't be picked.
3. Tap the items to give, then press **save claim**.
4. Items already claimed by the member show under **Claimed**.

Claims made this way are released immediately.

## Step 4. Release online claims
Sub-tab **Claims Masterlist**. An online claim waits here as **Pending Release**.

1. Find the claim.
2. Click **Pending Release**, confirm, and hand the item to the member.
3. The claim now shows **Released**, with your name under **Assisted By**.

Only someone **assigned to that item** can release it. Anyone else is told they can't.

### The Claims Masterlist

**ADD IMAGE HERE - Screenshot of the Claims Masterlist with pending claims**

| Column | Meaning |
| --- | --- |
| Status | **Released** or **Pending Release** |
| Claim ID, Item Name | The claim and its item |
| Passbook Number, First Name, Last Name | The member |
| Assisted By | The staff who released it |
| Claimed Mode | **Claimed Online** or **Staff Assistance** |
| Claimed Date / Released Date | When it was claimed and handed over |

Filter by **Claim Mode**, **Assisted by** and **Status**. Use **Delete** on a row to remove a claim entry, for example one made by mistake. The member can then claim that item again.

## Step 5. Check the reports

**ADD IMAGE HERE - Screenshot of the Reports sub-tab**
Sub-tab **Claim Reports**. It shows one block per staff or admin:

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

## Good to know
- Online claims need the member's **OTP** or **birthday**, so send OTPs from the Members tab first (see [[manage-event#Members]]).
- The claim requirement is checked against the member's current status, so register or survey members **before** they try to claim.
- Assign items **before** the event. Members can only see and claim items that are assigned to someone.
