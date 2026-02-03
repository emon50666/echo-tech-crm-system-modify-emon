
import React from 'react';
import { ProjectStatus, PaymentStatus } from './types';

export const STATUS_COLORS = {
  [ProjectStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ProjectStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ProjectStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  [ProjectStatus.DELIVERED]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

export const PAYMENT_COLORS = {
  [PaymentStatus.UNPAID]: 'text-red-600',
  [PaymentStatus.PARTIAL]: 'text-amber-600',
  [PaymentStatus.PAID]: 'text-emerald-600',
};

export const NavIcons = {
  Dashboard: <i className="fa-solid fa-chart-line"></i>,
  Projects: <i className="fa-solid fa-folder-open"></i>,
  Clients: <i className="fa-solid fa-users"></i>,
  Invoices: <i className="fa-solid fa-file-invoice-dollar"></i>,
  Activity: <i className="fa-solid fa-clock-rotate-left"></i>,
  Settings: <i className="fa-solid fa-cog"></i>,
};
