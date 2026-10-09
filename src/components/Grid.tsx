import type { HTMLAttributes, ReactNode } from 'react';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6;
export type LayoutGap = 1 | 2 | 3 | 4 | 5 | 6 | 8;

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: GridColumns;
  smColumns?: GridColumns;
  mdColumns?: GridColumns;
  lgColumns?: GridColumns;
  xlColumns?: GridColumns;
  gap?: LayoutGap;
}

const columns: Record<GridColumns, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' };
const smColumns: Record<GridColumns, string> = { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4', 5: 'sm:grid-cols-5', 6: 'sm:grid-cols-6' };
const mdColumns: Record<GridColumns, string> = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6' };
const lgColumns: Record<GridColumns, string> = { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6' };
const xlColumns: Record<GridColumns, string> = { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4', 5: 'xl:grid-cols-5', 6: 'xl:grid-cols-6' };
const gaps: Record<LayoutGap, string> = { 1: 'gap-1', 2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 5: 'gap-5', 6: 'gap-6', 8: 'gap-8' };

export function Grid({ children, columns: baseColumns = 1, smColumns: sm, mdColumns: md, lgColumns: lg, xlColumns: xl, gap = 4, className = '', ...props }: GridProps) {
  return <div className={`grid ${columns[baseColumns]} ${sm ? smColumns[sm] : ''} ${md ? mdColumns[md] : ''} ${lg ? lgColumns[lg] : ''} ${xl ? xlColumns[xl] : ''} ${gaps[gap]} ${className}`} {...props}>{children}</div>;
}

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  gap?: LayoutGap;
}

export function Stack({ children, gap = 4, className = '', ...props }: StackProps) {
  return <div className={`flex flex-col ${gaps[gap]} ${className}`} {...props}>{children}</div>;
}

export interface DashboardGridProps extends Omit<GridProps, 'columns' | 'mdColumns' | 'xlColumns'> {
  columns?: GridColumns;
  mdColumns?: GridColumns;
  xlColumns?: GridColumns;
}

export function DashboardGrid({ columns = 1, mdColumns = 2, xlColumns = 4, ...props }: DashboardGridProps) {
  return <Grid columns={columns} mdColumns={mdColumns} xlColumns={xlColumns} {...props} />;
}
