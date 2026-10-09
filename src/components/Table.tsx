import { createContext, useContext, type HTMLAttributes, type ReactNode, type TableHTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';

export type TableDensity = 'comfortable' | 'compact';

interface TableContextValue { density: TableDensity; }
const TableContext = createContext<TableContextValue>({ density: 'comfortable' });

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  children: ReactNode;
}

export function Table({ density = 'comfortable', className = '', children, ...props }: TableProps) {
  return (
    <TableContext.Provider value={{ density }}>
      <div className="w-full overflow-x-auto">
        <table className={`w-full border-collapse text-left text-body ${className}`} {...props}>{children}</table>
      </div>
    </TableContext.Provider>
  );
}

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;
export function TableHead({ className = '', ...props }: TableHeadProps) {
  return <thead className={`border-b border-border ${className}`} {...props} />;
}

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export function TableBody({ className = '', ...props }: TableBodyProps) {
  return <tbody className={`divide-y divide-border ${className}`} {...props} />;
}

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
export function TableRow({ className = '', ...props }: TableRowProps) {
  return <tr className={`transition-colors duration-fast hover:bg-surface-elevated ${className}`} {...props} />;
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> { children?: ReactNode; }
export function TableHeaderCell({ className = '', children, scope = 'col', ...props }: TableHeaderCellProps) {
  const { density } = useContext(TableContext);
  const padding = density === 'compact' ? 'px-3 py-2' : 'px-4 py-3';
  return <th scope={scope} className={`${padding} font-sans text-label font-semibold text-foreground-secondary ${className}`} {...props}>{children}</th>;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> { children?: ReactNode; }
export function TableCell({ className = '', children, ...props }: TableCellProps) {
  const { density } = useContext(TableContext);
  const padding = density === 'compact' ? 'px-3 py-2' : 'px-4 py-3';
  return <td className={`${padding} text-foreground ${className}`} {...props}>{children}</td>;
}

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
export function TableCaption({ className = '', ...props }: TableCaptionProps) {
  return <caption className={`mb-3 text-left font-sans text-caption text-foreground-muted ${className}`} {...props} />;
}

export { TableHeaderCell as Th, TableCell as Td };
