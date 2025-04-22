// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase'; // Import your firebase auth

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!auth.currentUser;

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
