import type { NotificationMessageType } from "@/src/lib/zod/notification";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/src/ui/shadcn/components/ui/table";

const Message = ({ message }: { message?: NotificationMessageType }) => {
  return (
    <section className="space-y-4">
      <header>
        <h1>Commit Message</h1>
        <p className="text-xs">Information about the changes</p>
      </header>

      <Table>
        {/* Body */}
        <TableBody>
          {/* Subject */}
          <TableRow>
            <TableCell>Subject</TableCell>
            <TableCell>{message?.subject || "[no-subject]"}</TableCell>
          </TableRow>

          {/* Message */}
          <TableRow>
            <TableCell>Message</TableCell>
            <TableCell>{message?.message || "[no-message]"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default Message;
