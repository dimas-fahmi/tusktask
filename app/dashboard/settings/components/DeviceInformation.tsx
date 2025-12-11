import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";

const DeviceInformation = ({ parsedUA }: { parsedUA: UAParser.IResult }) => {
  return (
    <section className="space-y-4">
      <header>
        <h1>Device Information</h1>
        <p className="text-xs">Information about the device</p>
      </header>

      <Table>
        {/* Body */}
        <TableBody>
          {/* Vendor */}
          <TableRow>
            <TableCell>Device Vendor</TableCell>
            <TableCell>
              {parsedUA?.device?.vendor || "[no-information]"}
            </TableCell>
          </TableRow>

          {/* Model */}
          <TableRow>
            <TableCell>Device Model</TableCell>
            <TableCell>
              {parsedUA?.device?.model || "[no-information]"}
            </TableCell>
          </TableRow>

          {/* Type */}
          <TableRow>
            <TableCell>Device Type</TableCell>
            <TableCell>
              {parsedUA?.device?.type || "[no-information]"}
            </TableCell>
          </TableRow>

          {/* OS */}
          <TableRow>
            <TableCell>Operating System</TableCell>
            <TableCell>{parsedUA?.os?.name || "[no-information]"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default DeviceInformation;
