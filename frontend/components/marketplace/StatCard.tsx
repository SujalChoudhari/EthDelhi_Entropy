import React from 'react';
import { StatCardProps } from './types';

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, colorClassName }) => (
  <div className="text-center p-3 bg-gray-50 rounded-lg">
    <Icon className={`h-8 w-8 mx-auto mb-2 ${colorClassName}`} />
    <div className={`text-2xl font-bold ${colorClassName.includes('green') ? 'text-green-600' : 'text-gray-900'}`}>
      {value}
    </div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default StatCard;
