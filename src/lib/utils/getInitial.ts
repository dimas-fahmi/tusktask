export const getInitial = (string?: string) => {
  if (!string) {
    return "N/A";
  }
  const splitted = string.split(" ");

  return `${splitted[0].at(0)}${splitted[splitted.length - 1].at(0)}`;
};
