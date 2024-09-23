import './home.scss';

import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { login } from 'app/shared/reducers/authentication';
import { Row, Col, Alert, Button, Form } from 'reactstrap';

import { ValidatedField } from 'react-jhipster';
import { type FieldError, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const MyLogin = () => {
  const dispatch = useAppDispatch();
  const pageLocation = useLocation();

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loginError = useAppSelector(state => state.authentication.loginError);

  const handleLogin = ({ username, password, rememberMe = false }) => {
    dispatch(login(username, password, rememberMe));
  };

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });

  const handleLoginSubmit = e => {
    handleSubmit(handleLogin)(e);
  };

  const { from } = pageLocation.state || { from: { pathname: '/home', search: pageLocation.search } };
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="justify-content-center">
      <Row className="justify-content-center align-items-center">
        <Col md="6" className="text-center">
          <div className="display-6 mt-4">Welcome to Web Messenger!</div>
        </Col>
      </Row>
      <Row className="justify-content-center" noGutters>
        <Col md="6" className="justify-content-center">
          <Form onSubmit={handleLoginSubmit}>
            <div className="mt-1">&nbsp;</div>
            <Row>
              <Col md="12">
                {loginError ? (
                  <Alert color="danger" data-cy="loginError">
                    <strong>Failed to sign in!</strong> Please check your credentials and try again.
                  </Alert>
                ) : null}
              </Col>
              <Col md="12">
                <ValidatedField
                  name="username"
                  label="Username"
                  placeholder="Your username"
                  required
                  autoFocus
                  data-cy="username"
                  validate={{ required: 'Username cannot be empty!' }}
                  register={register}
                  error={errors.username as FieldError}
                  isTouched={touchedFields.username}
                />
                <ValidatedField
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Your password"
                  required
                  data-cy="password"
                  validate={{ required: 'Password cannot be empty!' }}
                  register={register}
                  error={errors.password as FieldError}
                  isTouched={touchedFields.password}
                />
                <ValidatedField hidden name="rememberMe" type="checkbox" check label="Remember me" value={true} register={register} />
              </Col>
            </Row>
            <div className="mt-1">&nbsp;</div>
            <Alert color="warning">
              <Link to="/account/reset/request" data-cy="forgetYourPasswordSelector">
                Did you forget your password?
              </Link>
            </Alert>
            <Alert color="warning">
              <span>You don&apos;t have an account yet?</span> <Link to="/account/register">Register a new account</Link>
            </Alert>
            <Button color="primary" type="submit" data-cy="submit">
              Sign in
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default MyLogin;
