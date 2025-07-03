
export type BookingMode = 'flight' | 'bus' | 'train' | 'hotel';

export interface TestData {
  source?: string;
  destination?: string;
  date?: string;
  returnDate?: string;
  passengers?: number;
  children?: number;
  infants?: number;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  travelClass?: string;
  testCaseId?: string;
  browserType?: string;
  testType?: string;
}

export interface BaseField {
  key: string;
  label: string;
  type: string;
  icon: React.ComponentType<any>;
  description: string;
}

export interface SelectField extends BaseField {
  type: 'select';
  options: string[];
}

export interface InputField extends BaseField {
  type: 'text' | 'date' | 'number';
  placeholder?: string;
}

export type FormField = SelectField | InputField;
