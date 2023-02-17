import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Login.css';

export function Login() {
  return (
    <div className="text-center">
      <Link to="/student">
        <Button
          className="mx-2"
          variant="outline-primary">
          Student
        </Button>
      </Link>
      <Link to="/instructor">
        <Button
          className="mx-2"
          variant="outline-primary">
          Instructor
        </Button>
      </Link>
    </div>
  );
}