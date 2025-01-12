import {Holiday} from './holiday';

export interface Page {
  title: string;
  icon: string;
  route: string;
  requiresAuthentication: boolean;
}

export interface TableColumnDef<T> {
  columnDef: string;
  header: string;
  rowType: string;
  cell: (element: T) => string;
}
