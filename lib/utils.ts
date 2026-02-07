import { user } from "next-auth";
import { Role } from "@prisma/client";
import { twMerge } from "tailwind-merge"
import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAllowed = (roleAllowed: Role[], user : user | false | null | undefined ) => {
    if(!user) return false;
    return roleAllowed.includes(user.role);
};

export const tableToExcel = (table: HTMLDivElement, name: string) => {
    const uri = "data:application/vnd.ms-excel;base64,";
    const template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
    const base64 = (s: string) => window.btoa(unescape(encodeURIComponent(s)));
    const format = (s: string, c: Record<string, string>) =>
        s.replace(/{(\w+)}/g, (m, p) => c[p]);

    const ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
    const excelContent = uri + base64(format(template, ctx));

    const link = document.createElement("a");
    link.href = excelContent;

    link.setAttribute("download", name || "table.xls");

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
};

export const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

export function isSameDayIgnoreTimezone(date1: string | Date, date2: string | Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
