import React from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {selectToken} from './store/session-slice';

import Login from './components/login';


function App() {
    const isLogged = Boolean(useSelector(selectToken));

    return (
        <BrowserRouter>
            <Route path="/login" exact>
                { isLogged ? <Redirect to="/" /> : <Login/> }
            </Route>

            <Route path="/" exact>
                { !isLogged ? <Redirect to="/login" /> : <p>logged</p> }
            </Route>
        </BrowserRouter>
    );
}

export default App;
