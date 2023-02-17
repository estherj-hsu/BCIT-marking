import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export function StudentList(props) {
  const { studentList } = props;
  return (
    <div className="text-center">
      {studentList.map(student => (
        <Link to={`/student/${student.id}`}>
          <Button
            className="mx-2"
            variant="outline-primary">
            {student.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}