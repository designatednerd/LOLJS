// react classes imports
import React from 'react';
import ReactDOM from 'react-dom';

// additional imports
import registerServiceWorker from './registerServiceWorker';
import MainWindow from './MainWindow';

ReactDOM.render((<MainWindow />), document.getElementById('root'));
registerServiceWorker();
