import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import './i18n';

import App from './App';
import configureStore from './redux/configure-store';
import { history } from './utils/history';

import './scss/main.scss';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-image-lightbox/style.css';
import { Provider } from 'react-redux';

const store = configureStore(undefined);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
  , document.getElementById('root')
);
