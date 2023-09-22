import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, path }) => {
  return (
    <Link to={path} className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
    </Link>
  );
};

export default Card;
