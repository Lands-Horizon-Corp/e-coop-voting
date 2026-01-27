import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TIncentiveClaimReportsPerUser } from "@/types";

type Props = { UserReport: TIncentiveClaimReportsPerUser; eventId: number };

const UserReportTable = ({ UserReport, eventId }: Props) => {
  const { name } = UserReport.user;
  const assignedIncentives = UserReport.incentives;
  const assists = UserReport.membersAssisted;

  return (
    <>
      <TableBody>
        <TableRow className="bg-transparent hover:bg-transparent border-none">
          <TableCell>
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableCell className="w-[400px]">
                    <p>
                      <span className="text-foreground/60">Staff/Admin :</span>{" "}
                      {name}
                    </p>
                  </TableCell>
                  <TableCell colSpan={1 + assignedIncentives.length}>
                    <p className="text-right">
                      <span className="text-foreground/60">Total Assist :</span>{" "}
                      {assists.length}
                    </p>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={2 + assignedIncentives.length}
                    className="w-[100px]"
                  >
                    <p>
                      <span className="text-foreground/60">Event ID:</span>{" "}
                      {eventId}
                    </p>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableHead className="min-w-[100px]">Member Name</TableHead>
                  <TableHead>Pb Number</TableHead>
                  {assignedIncentives.map((incentive) => (
                    <TableHead className="text-center" key={incentive.id}>
                      {incentive.itemName}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {assists.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2 + assignedIncentives.length}>
                      <p className="text-center text-foreground/30 text-sm">
                        no assists
                      </p>
                    </TableCell>
                  </TableRow>
                )}
                {assists.map((assisted) => (
                  <TableRow key={assisted.id}>
                    <TableCell className="font-medium">{`${assisted.firstName} ${assisted.lastName}`}</TableCell>
                    <TableCell>{assisted.passbookNumber}</TableCell>
                    {assignedIncentives.map((incentive) => (
                      <TableCell className="text-center" key={incentive.id}>
                        {
                          assisted.incentiveClaimed.filter(
                            (claimEntry) =>
                              claimEntry.incentiveId === incentive.id,
                          ).length
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow className="bg-secondary/60 hover:bg-secondary/70">
                  <TableCell colSpan={2}>Total Issued</TableCell>
                  {assignedIncentives.map((incentive) => {
                    const assistsFiltered = assists.filter((assist) =>
                      assist.incentiveClaimed.some(
                        (claims) => claims.incentiveId === incentive.id,
                      ),
                    );

                    const itemCount = assistsFiltered.length;

                    return (
                      <TableCell className="text-center" key={incentive.id}>
                        {itemCount}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow className="bg-secondary/60 hover:bg-secondary/70">
                  <TableCell colSpan={2}>Total Assigned</TableCell>
                  {assignedIncentives.map((incentive) => {
                    const assigned = UserReport.incentiveAssigned.find(
                      (assigned) => assigned.incentiveId === incentive.id,
                    );

                    return (
                      <TableCell className="text-center" key={incentive.id}>
                        {assigned ? (
                          assigned.assignedQuantity
                        ) : (
                          <p className="text-xs italic text-foreground/40">
                            not assigned
                          </p>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow className="bg-secondary/60 hover:bg-secondary/70">
                  <TableCell colSpan={2}>Total Onhand</TableCell>
                  {assignedIncentives.map((incentive) => {
                    const assistsFiltered = assists.filter((assist) =>
                      assist.incentiveClaimed.some(
                        (claims) => claims.incentiveId === incentive.id,
                      ),
                    );

                    const issuedQty = assistsFiltered.length;
                    let assignedQty: number;

                    const assigned = UserReport.incentiveAssigned.find(
                      (assigned) => assigned.incentiveId === incentive.id,
                    );

                    assignedQty = assigned ? assigned.assignedQuantity : 0;

                    const onHand = assignedQty - issuedQty;

                    return (
                      <TableCell className="text-center" key={incentive.id}>
                        {assigned ? (
                          onHand
                        ) : (
                          <p className="text-xs italic text-foreground/40">
                            not assigned
                          </p>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
        <TableRow className="bg-transparent hover:bg-transparent border-none">
          <TableCell>
            <div className="h-1" />
          </TableCell>
        </TableRow>
      </TableBody>
    </>
  );
};

export default UserReportTable;
