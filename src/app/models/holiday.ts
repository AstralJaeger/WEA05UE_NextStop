export interface Holiday {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  type: string;
}

export const HolidayTpeMap: Map<string, number> = new Map<string, number>([
  ['Bank Holiday', 0],
  ['School Vacation', 1],
  ['National Holiday', 2],
  ['Religious Holiday', 3],
  ['Other', 4],
]);

export const HolidayTypes: string[] = ['Bank Holiday', 'School Vacation', 'National Holiday', 'Religious Holiday', 'Other'];
