import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers/';
import loggerMiddleware from '../middlewares/loggerMiddleware';
import { history } from '../utils/history';

const configureStore = (state: any) => {
    let middlewares = [];
    let middlewareEnhancer;
    // TODO : we can apply more middlware in future.
    middlewares.push(createRouterMiddleware(history));
    middlewares.push(thunkMiddleware);

    if (process.env.NODE_ENV === 'development') {

        middlewares.push(loggerMiddleware);
        middlewareEnhancer = composeWithDevTools(
            applyMiddleware(...middlewares)
        );
    } else {
        middlewareEnhancer = applyMiddleware(...middlewares);
    }

    const store = createStore(combineReducers(reducers), state, middlewareEnhancer);

    return store;
};

export default configureStore;
