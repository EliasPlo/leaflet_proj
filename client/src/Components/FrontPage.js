// /project/client/src/Components/FrontPage.js

import React from 'react';
import { Link } from 'react-router-dom';

function FrontPage() {
  return (
    <div className="front-page">
      <h1>Welcome to the Map Application</h1>
      <p>Explore the map and add or view markers.</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}

export default FrontPage;
