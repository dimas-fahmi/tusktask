import { DateTime } from "luxon";
import type { ActiveSession } from "@/src/lib/app/app";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";

const SessionInformation = ({ session }: { session: ActiveSession }) => {
  return (
    <section className="space-y-4">
      <header>
        <h1>Session Information</h1>
        <p className="text-xs">Information about the session</p>
      </header>

      <Table>
        {/* Body */}
        <TableBody>
          {/* Start At */}
          <TableRow>
            <TableCell>Start Around</TableCell>
            <TableCell>
              {DateTime.fromJSDate(session.createdAt).toRelative() ||
                "[no-information]"}
            </TableCell>
          </TableRow>

          {/* Updated At */}
          <TableRow>
            <TableCell>Updated Around</TableCell>
            <TableCell>
              {DateTime.fromJSDate(session.updatedAt).toRelative() ||
                "[no-information]"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default SessionInformation;
