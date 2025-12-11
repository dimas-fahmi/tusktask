import type { LookupResponse } from "node-iplocate";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";

const IpLocation = ({ ipLookUp }: { ipLookUp: LookupResponse }) => {
  return (
    <section className="space-y-4">
      <header>
        <h1>IP Address Geolocation</h1>
        <p className="text-xs">
          Information about the IP Address last known position
        </p>
      </header>

      <Table>
        {/* Body */}
        <TableBody>
          {/* City */}
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell>{ipLookUp?.city || "[no-information]"}</TableCell>
          </TableRow>

          {/* Subdivision */}
          <TableRow>
            <TableCell>Subdivision</TableCell>
            <TableCell>{ipLookUp?.subdivision || "[no-information]"}</TableCell>
          </TableRow>

          {/* Country */}
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell>{ipLookUp?.country || "[no-information]"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default IpLocation;
