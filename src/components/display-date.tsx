import { parseISO, format } from "date-fns";
import Datetime from "react-datetime";
import { Heading, Text } from "rebass";

export function NormalDate({ dateString }: { dateString: string }) {
  const date = parseISO(dateString);
  return <Text dateTime={dateString}>{format(date, "LLLL d, yyyy")}</Text>;
}
export function TopDisplayDate({ dateString }: { dateString: string }) {
  const date = parseISO(dateString);
  return (
    <Heading dateTime={dateString}>
      {format(date, "MMM, yyyy") ? format(date, "MMM, yyyy") : ""}
    </Heading>
  );
}
