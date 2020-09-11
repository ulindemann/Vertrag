import React, { useState } from 'react';
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { Route, Switch} from 'react-router-dom';
import VertragHome from './vertrag.js';
import { Navi } from "./nav.js";
import Login from './login.js';
import AdminPage from './admin.js';
import TestPage from './test.js';
import TabDisplay from './table/tabdisplay.js';

//import UserContext from './usercontext.js';
//import './App.css';

/*********************************************************************************************************************
 *  Contexte
 */
export const UserContext = React.createContext (
	/*{
	logged: false,
	name: '',
	setName: () => {}
	}*/
	null
);


export const ErrorContext = React.createContext (
	null
);



/*********************************************************************************************************************
 *  the one and only 
 */
export const App = (() => {

	const [LoggedIn, setLoggedIn] = useState ( true ); // Achtung!  Production = false!
	const [User, setUser] = useState ( 'lindemann');

	const setName = ((name) => {
		setUser( name );
		setLoggedIn ( true );
	});

	const [Error, setError] = useState (
		{
			show: false,
			title: '',
			text: ''
		}
	);
	
	return (
	<div className="App" >
		<UserContext.Provider value={{ LoggedIn, User, setName }} >
		<ErrorContext.Provider value={{Error, setError}}>
		<Router>
			<Navi  />
			<Switch>
				<Route exact path="/">
					{ LoggedIn ? <VertragHome /> : <Redirect to="/login" /> }
				</Route> 
				<Route path="/login" component={Login} />
				<Route path="/display"> 
					{ LoggedIn ? <TabDisplay /> : <Redirect to="/login" /> }
				</Route>
				<Route path="/admin">
					{ LoggedIn ? <AdminPage /> : <Redirect to="/login" /> }
				</Route>
				<Route path="/test"  component={TestPage} />
			</Switch>
		</Router>
		</ErrorContext.Provider>
		</UserContext.Provider>
	</div>
	);
});
