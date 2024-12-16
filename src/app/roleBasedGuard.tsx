import React from 'react';
import { useAppSelector } from '@/app/redux';
import AccessDeniedModal from '@/components/AccessDenied';

const roleBasedGuard = (
  Component: React.ComponentType<any>,
  allowedRoles: string[]
) => {
  return function GuardedComponent(props: any) {
    const userRole = useAppSelector((state) => state.global.user?.role);

    if (!userRole || !allowedRoles.includes(userRole)) {
      return <AccessDeniedModal isOpen={props.isOpen} onClose={props.onClose} />;
    }

    return <Component {...props} />;
  };
};

export default roleBasedGuard;