import React from 'react';

import '../styles/about.css';

const About = (props) => {
  return (
    <div className="about-section">
      <p>
        This full-stack application was build with an Express and MongoDB backend, and a React front end.
        When a stock is added or deleted by any user, all users will see the updated changes in real-time
        via <a href='https://socket.io/' target='_blank'>socket.io</a>.
    </p>
      <div className="list-container">
        <h4>User Story Requirements:</h4>
        <ol className="user-story-list">
          <li>I can view a graph displaying the recent trend lines for each added stock.</li>
          <li>I can add new stocks by their symbol name.</li>
          <li>I can remove stocks.</li>
          <li>
            I can see changes in real-time when any other user adds or removes a stock. 
            For this you will need to use Web Sockets.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default About;
