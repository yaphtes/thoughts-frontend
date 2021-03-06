import { createStore, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../actions/root-saga';
import reducer from '../reducers';
import initialState from './initialState';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(
  applyMiddleware(routerMiddleware(history), sagaMiddleware)
));

sagaMiddleware.run(rootSaga);

export { history };
export default store;