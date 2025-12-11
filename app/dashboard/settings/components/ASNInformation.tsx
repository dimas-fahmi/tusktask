import type { LookupResponse } from "node-iplocate";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";

const ASNInformation = ({ ipLookUp }: { ipLookUp: LookupResponse }) => {
  return (
    <section className="space-y-4">
      <header>
        <h1>ASN</h1>
        <p className="text-xs">Information about the IP Address ASN Provider</p>
      </header>

      <Table>
        {/* Body */}
        <TableBody>
          {/* ASN Name */}
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{ipLookUp?.asn?.name || "[no-information]"}</TableCell>
          </TableRow>

          {/* Country */}
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell>
              {ipLookUp?.asn?.country_code || "[no-information]"}
            </TableCell>
          </TableRow>

          {/* Net Name */}
          <TableRow>
            <TableCell>Net Name</TableCell>
            <TableCell>
              {ipLookUp?.asn?.netname || "[no-information]"}
            </TableCell>
          </TableRow>

          {/* ASN Domain */}
          <TableRow>
            <TableCell>Domain</TableCell>
            <TableCell>{ipLookUp?.asn?.domain || "[no-information]"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default ASNInformation;
