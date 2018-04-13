import React, { Component } from 'react';
import { combineReducers, createStore as initialCreateStore } from 'redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';

import Home from './home';

import reducers from '../reducers';

export let createStore = initialCreateStore;

const reducer = combineReducers({ homeReducer: reducers.homeReducer.homeReducer });
const initialState = {
  homeReducer: { ...reducers.homeReducer.initialState },
};
const store = createStore(reducer, initialState);

export default class App extends Component {
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-8'>
            <div className='panel panel-default'>
              <div className='panel-heading'>Simple test task</div>
              <div className='panel-body'>
                <Provider store={store}>
                  <Home/>
                </Provider>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

if (document.getElementById('app')) {
  ReactDOM.render(<App/>, document.getElementById('app'));
}
