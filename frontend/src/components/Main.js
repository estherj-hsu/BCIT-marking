import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Assignment } from './Assignment';
import { Login } from './Login';
import { Marker } from './Marker';
import { StudentList } from './StudentList';
import { Container, Row, Col } from 'react-bootstrap';
import { API_URL } from '../common/config';
import axios from 'axios';
import './Main.css';

export function Main() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents();
  }, [])

  const getStudents = () => {
    axios.get(`${API_URL}/students`).then((response) => {
      setStudents(response.data);
    });
  }

  return (
    <Container className="main">
      <Row
        className="d-flex align-items-center justify-content-center">
        <Col xs lg="5">
          <Routes>
            <Route
              path="/"
              element={<Login />} />
            <Route
              path="/student"
              element={<StudentList studentList={students} />} />
            <Route
              path="/student/:idx"
              element={<Assignment />} />
            <Route
              path="/instructor"
              element={<Marker />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}