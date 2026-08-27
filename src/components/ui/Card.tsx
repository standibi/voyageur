/* eslint-disable */
import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};
