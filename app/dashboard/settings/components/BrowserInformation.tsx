import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";

const BrowserInformation = ({ parsedUA }: { parsedUA: UAParser.IResult }) => {
  return (
    <section className="space-y-4">
      <header>
        <h1>Browser Information</h1>
        <p className="text-xs">Information about the browser</p>
      </header>

      <Table>
        {/* Body */}
        <TableBody>
          {/* Browser Name */}
          <TableRow>
            <TableCell>Browser Name</TableCell>
            <TableCell>
              {parsedUA?.browser?.name || "[no-information]"}
            </TableCell>
          </TableRow>

          {/* Browser Version */}
          <TableRow>
            <TableCell>Browser Version</TableCell>
            <TableCell>
              {parsedUA?.browser?.version || "[no-information]"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default BrowserInformation;
