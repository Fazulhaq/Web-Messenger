import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';

export const Logout = () => {
  const authentication = useAppSelector(state => state.authentication);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (authentication.logoutUrl) {
      window.location.href = authentication.logoutUrl;
    } else if (!authentication.isAuthenticated) {
      window.location.href = '/';
    }
  }, [authentication.logoutUrl, authentication.isAuthenticated]);

  return (
    <div className="p-5">
      <h4>Logged out successfully!</h4>
    </div>
  );
};

export default Logout;
