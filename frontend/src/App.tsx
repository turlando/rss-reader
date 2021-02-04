import React from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {selectToken} from './store/session-slice';

import Login from './components/login';
import Signup from './components/signup';
import Reader from './components/reader';


function App() {
    const isLogged = Boolean(useSelector(selectToken));

    return (
        <BrowserRouter>
            <Route path="/login" exact>
                { isLogged ? <Redirect to="/" /> : <Login/> }
            </Route>

            <Route path="/signup" exact>
                { isLogged ? <Redirect to="/" /> : <Signup/> }
            </Route>

            <Route path="/" exact>
                { !isLogged ? <Redirect to="/login" /> : <Reader/> }
            </Route>
        </BrowserRouter>
    );
}

export default App;
