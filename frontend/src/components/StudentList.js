import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col } from 'react-bootstrap';

export function StudentList(props) {
  const { studentList, isMarking } = props;
  const navigate = useNavigate();

  return (
    <Row className="d-flex align-items-center justify-content-center text-center">
      {studentList.map(student => {
        const isDone = (isMarking && student.emptyMarks === 0) || (!isMarking && student.emptyAssignments === 0);
        const isNotReady = isMarking && student.emptyAssignments !== 0;

        return (
          <Col>
            <Card>
              <Card.Header>{student.firstName} {student.lastName}</Card.Header>
              <Card.Body>
                <Card.Text>
                  Undone Assignments: {student.emptyAssignments}
                </Card.Text>
                <Button
                  disabled={isDone || isNotReady}
                  className="mx-2"
                  onClick={() => navigate(`${isMarking ? '/instructor' : ''}/student/${student.id}`)}
                  variant={`${isDone || isNotReady ? 'outline-' : ''}primary`}>
                  {isDone ? 'All Done' : isMarking ? 'Mark' : 'Start'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )
      })}
    </Row>
  );
}