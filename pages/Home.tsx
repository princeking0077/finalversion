// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Course } from '../types';
import { COURSES } from '../constants';

export const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(COURSES);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.getCourses();
        if (data && data.length > 0) setCourses(data);
      } catch (e) {
        console.error('fetch courses error', e);
      }
    };
    fetch();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Home Placeholder</h1>
      <p>Courses loaded: {courses.length}</p>
      <button onClick={() => navigate('/courses')} className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded">
        View Courses
      </button>
    </div>
  );
};
