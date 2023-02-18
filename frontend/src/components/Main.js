import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Assignment } from './Assignment';
import { Login } from './Login';
import { Marker } from './Marker';
import { StudentList } from './StudentList';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { API_URL } from '../common/config';
import { isEmpty, pickBy, size } from "lodash";
import axios from 'axios';
import './Main.css';

export function Main() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents();
  }, [])

  const getStudents = () => {
    axios.get(`${API_URL}/students`).then((response) => {
      const studentData = response.data.map(stu => {
        const emptyAssignments = size(pickBy(stu, (value, key) => key.startsWith("answer") && isEmpty(value)));
        const emptyMarks = size(pickBy(stu, (value, key) => key.startsWith("mark") && isEmpty(value)));
        const student = {
          ...stu,
          emptyAssignments,
          emptyMarks
        };
        return student
      });

      setStudents(studentData);
    });
  }

  return (
    <Container className="main">
      <Row
        className="d-flex align-items-center justify-content-center text-center min-vh-100">
        <Col xs="6">
          {isEmpty(students) ? <Spinner/> :
            <Routes>
              <Route
                path="/"
                element={<Login />} />
              <Route
                path="/student"
                element={<StudentList isMarking={false} studentList={students} />} />
              <Route
                path="/student/:id"
                element={<Assignment studentList={students} />} />
              <Route
                path="/instructor"
                element={<StudentList isMarking={true} studentList={students} getStudents={getStudents} />} />
              <Route
                path="/instructor/student/:id"
                element={<Marker studentList={students} />} />
            </Routes>
          }
        </Col>
      </Row>
    </Container>
  );
}