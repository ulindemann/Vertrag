mail = require('sendmail')();

mail({
	   from: 'lindemann@lwnet.de',
       to: 'it@lwnet.de',
       subject: 'Mail versendet mit sendmail',
       content: 'Kein text.'
   },
   function(err,response){
      if(err){
         console.log(err);
      }
      console.dir(response);
});