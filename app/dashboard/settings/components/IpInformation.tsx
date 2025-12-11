import type { LookupResponse } from "node-iplocate";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";

const IpInformation = ({ ipLookUp }: { ipLookUp: LookupResponse }) => {
  return (
    <section className="space-y-4">
      <header>
        <h1>IP Address Information</h1>
        <p className="text-xs">About the IP Address information</p>
      </header>

      <Table>
        {/* Body */}
        <TableBody>
          {/* IP Address */}
          <TableRow>
            <TableCell>IP Address</TableCell>
            <TableCell>{ipLookUp?.ip || "[no-information]"}</TableCell>
          </TableRow>

          {/* Is Flag Abusive */}
          <TableRow>
            <TableCell>Abusive</TableCell>
            <TableCell>
              {ipLookUp?.privacy?.is_abuser || "No/Unknown"}
            </TableCell>
          </TableRow>

          {/* Is Flag Abusive */}
          <TableRow>
            <TableCell>VPN</TableCell>
            <TableCell>
              {ipLookUp?.privacy?.is_vpn || "[no-information]"}
            </TableCell>
          </TableRow>

          {/* Is Flag Abusive */}
          <TableRow>
            <TableCell>Associated Company</TableCell>
            <TableCell>
              {ipLookUp?.company?.name || "[no-information]"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default IpInformation;
