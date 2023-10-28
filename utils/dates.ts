import { add, format } from "date-fns";
import { pt } from "date-fns/locale";

export const getMothName = (date: string | Date) =>
  format(add(new Date(date), { hours: 4 }), "MMMM", { locale: pt });
