// nav.js --  Navbar

import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { UserContext } from './App.js';

const Navi = ((props) => {

    const { LoggedIn, User, setName} = useContext ( UserContext );
    //console.log (UserContext);

    const Login = (() => {

    });

    return (
        <Navbar variant="dark" bg="light" fixed="top" style={{height: "40px"}}>
            <Navbar.Brand > 
    
            <img
                src="lwerk-logo.png"
                className="d-inline-block align-top"
                //className ="align-center"
                width="200"
                height="60"
                alt="lwerk"
                border="solid"
            />
            </Navbar.Brand>
            <Nav justify={true} variant="pills">
                <Nav.Item style={{width: "200px"}} disabled={!LoggedIn}>
                    <Link to="/">Vertragsverwaltung</Link>
                </Nav.Item>
                <Nav.Item style={{width: "200px"}} disabled={!LoggedIn}>
                    <Link to="/display">Tabelle</Link>
                </Nav.Item>
                <Nav.Item style={{width: "200px"}} disabled={!LoggedIn}>
                    <Link to="/admin">Administration</Link>
                </Nav.Item>
                <Link to="/test">Test</Link>
            </Nav>
           
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text style={{backgroundColor: "#ffffff", color: "#000000", width: "200px", height: "32px", textAlign: "center"}}>
                    <h5>{User}</h5>
                </Navbar.Text>
                <Button variant="outline-info" onClick={Login}>Anmelden</Button>
            </Navbar.Collapse>
        </Navbar>
    );    
});


const Footi = (() => {

    return (
        <Navbar variant="dark" bg="dark" fixed="bottom">
            <Navbar.Text>text</Navbar.Text>
        </Navbar>
    );
});


export {Navi, Footi};