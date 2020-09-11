/**
 * 
 *  socket.io
 */
const SEKUNDE = 1000;
const MINUTE = SEKUNDE * 60;
const STUNDE = MINUTE * 60;
const TAG    = STUNDE * 24;


module.exports = function ( server ) {

	var val = 0;
	var val2 = 0;

	var io = require ('socket.io')(server);



	interval = setInterval (() => {
  		io.sockets.emit ('chat', "Server sendet:", val );
  		console.log ('Sende: ' + val.toString());
  		++val;
	}, STUNDE );

	interval2 = setInterval (() => {
		io.sockets.emit ('chat', "Server sendet 2:", val2 );
		console.log ('Sende: ' + val2.toString());
		++val2;
  	}, MINUTE );



	io.on('connection', (socket) => {
  		const { id } = socket.client;
		  console.log ( "User connnected ID: " + id );
		  
  		socket.on ("chat", msg => {
    		console.log ( id + ": " + msg );
    		socket.broadcast.emit ("chat", id, msg);
  		});
  

  		socket.on ('disconnect', () => {
    		console.log ( 'user disconnected');
	  	});
	}); 
}