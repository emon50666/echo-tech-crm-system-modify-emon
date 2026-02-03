
export enum ProjectStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DELIVERED = 'Delivered'
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PARTIAL = 'Partial',
  PAID = 'Paid'
}

export interface AgencyProfile {
  name: string;
  subtitle: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  logoUrl?: string;
}

export interface WebsiteAccess {
  url: string;
  username: string;
  password?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
  registrationDate?: string;
  access?: WebsiteAccess;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  description: string;
  price: number; // Total Budget
  advancePaid: number; // Advance Amount
  status: ProjectStatus;
  paymentStatus: PaymentStatus;
  startDate: string;
  estDeliveryDate: string;
  actualCompletionDate?: string;
  liveLink?: string;
  notes: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  amount: number; // Current Payment
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'Status Change' | 'Project Created' | 'Project Deleted' | 'Client Added' | 'Client Deleted' | 'Payment Received' | 'Email Sent';
  description: string;
  user: string;
  details?: any;
}
