import React,  { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';
import { API_URL } from '../common/config';
import { markingApi } from '../common/api';
import './Login.css';

export function Login(props) {
  const [formValue, setFormValue] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false || !isValidated) {
      event.stopPropagation();
    }
    setIsValidated(true);
    handleLogin();
  };

  const handleLogin = () => {
    const isInstructor = formValue.loginAs === 'instructor' ? true : false;
    markingApi.post(`${API_URL}/${formValue.loginAs}s/login`, formValue).then((response) => {
      const { token, id } = response.data;

      // Save Token
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('isInstructor', isInstructor);

      // Reset Login Form
      setFormValue({});
      formRef.current.reset();
      props.setIsLogin(true);

      // Redirect
      navigate(isInstructor ? '/instructor' : `/student/${id}`);
    });
  };

  return (
    <Row className="justify-content-center">
      <Col xs={5}>
        <Card>
          <Card.Header>Login</Card.Header>
          <Card.Body>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Form.Control
                required
                onChange={e => setFormValue({ ...formValue, [e.target.name]: e.target.value })}
                size="sm"
                type="text"
                placeholder="Email"
                name="email"
                className="d-inline mb-3" />
              <Form.Control
                required
                onChange={e => setFormValue({ ...formValue, [e.target.name]: e.target.value })}
                size="sm"
                type="password"
                placeholder="Password"
                name="password"
                className="d-inline mb-3" />
              <Form.Group className="text-start mb-3">
                <Form.Check
                  required
                  inline
                  onChange={(e) => setFormValue({ ...formValue, [e.target.name]: e.target.value })}
                  type="radio"
                  name="loginAs"
                  id="student"
                  value="student"
                  label="Student" />
                <Form.Check
                  required
                  inline
                  onChange={(e) => setFormValue({ ...formValue, [e.target.name]: e.target.value })}
                  type="radio"
                  name="loginAs"
                  id="instructor"
                  value="instructor"
                  label="Instructor" />
              </Form.Group>
              <Button
                className="mx-2"
                size="sm"
                type="submit"
                variant="outline-primary">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}