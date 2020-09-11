var express = require('express');
var router = express.Router();
//  const pool =  require ('./maria.js');
const db = require('./postgres.js');
const sprintf = require('sprintf-js').sprintf;

// active directory
var ActiveDirectory = require('activedirectory2');
var config = {
	url: 'ldap://192.168.1.30:389',
	baseDN: 'ou=FSD,dc=lwnet,dc=local',
	username: 'lindemann@lwnet.local',
	password: 'nnamednil'
};
var ad = new ActiveDirectory(config);

/**********************************************************************************************************
 *  USERAUTH
 */
router.post ('/api/post/userauth', async (req, res) => {

	try {
	  let user = req.body.data;
	  let group = 'Lwerk_gesamt';
	  console.log ( user.name + " " + user.passwort );
  
	  ad.authenticate ( user.name + "@lwnet.de", user.passwort, (err, auth) => {
		if ( err) {
		  console.log ('authentifizierung fehler!');
		  res.sendStatus ( 404 );
		}  
		if ( auth ) {
		  console.log ('authentifizierung OK!');
		  ad.isUserMemberOf ( user.name, group, (err, isMember) => {
			
			if ( err ) {
			  console.log ('isMemberOf Fehler!');
			  res.sendStatus ( 404 );
			}
			console.log ('OK');
			res.send ( 'OK');
		  })
		}
	  });
  
	}
	catch {
	  console.log ('ERROR try');
	  res.sendStatus ( 500 );
	}
  });
  
  module.exports = router;  
