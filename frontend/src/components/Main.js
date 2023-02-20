import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Assignment } from './Assignment';
import { Login } from './Login';
import { Marker } from './Marker';
import { StudentList } from './StudentList';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { API_URL } from '../common/config';
import { markingApi } from '../common/api';
import { isEmpty, pickBy, size, isNull } from "lodash";
import './Main.css';

export function Main() {
  const [students, setStudents] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      getStudents();
    } else {
      handleLogout();
    }
  }, [isLogin])

  const getStudents = () => {
    markingApi.get(`${API_URL}/students`).then((response) => {
      const studentData = response.data.map(stu => {
        const emptyAssignments = size(pickBy(stu, (value, key) => key.startsWith("answer") && isNull(value)));
        const emptyMarks = size(pickBy(stu, (value, key) => key.startsWith("mark") && isNull(value)));
        const student = {
          ...stu,
          emptyAssignments,
          emptyMarks
        };

        return student;
      });
      console.log('student',studentData)

      setStudents(studentData);
    });
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLogin(false);
    navigate('/');
  }

  return (
    <Container className="main">
      {isLogin ?
        <div className="text-end pt-2">
          <Button
            variant="warning"
            onClick={() => handleLogout()}
            size="sm">
            Logout
          </Button>
        </div>
      : null}
      <Row
        className="d-flex align-items-center justify-content-center text-center min-vh-100">
        <Col xs="6">
          {!isLogin ?
            <Routes>
              <Route
                path="/"
                element={<Login setIsLogin={setIsLogin} />} />
            </Routes>
          :
          isEmpty(students) ? <Spinner/> :
            <Routes>
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
                element={<Marker studentList={students} getStudents={getStudents} />} />
            </Routes>
          }
        </Col>
      </Row>
    </Container>
  );
}