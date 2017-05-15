import React from 'react'
import ReactDOM from 'react-dom';

import App from './containers/App';

// feature detection for touch events to allow
// for css styling for touch screens
/* 
example:
.no-touchevents .box { color: red; }
.touchevents .box { color: green; }
*/
import './modernizr-touch';

ReactDOM.render(<App />, document.getElementById('root'));
