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

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//-----------------------------------------------------------------------------------
router.get ('/api/get/standorte', async (req, res) => {

  const qry = "SELECT * FROM tb_standort";
  
  try {
    const standorte = await db.many (qry);
    //console.log ( standorte );
    res.send ( standorte );
  }
  catch(e) {
    //console.log ('Fehler /api/get/standorte: ' + e );
    res.end ('ERROR');
  }
}); 



//-----------------------------------------------------------------------------------
router.get ('/api/get/standort', async (req, res) => {

  const qry = "SELECT * FROM tb_standort WHERE id = " + req.query.id; //.toString();
  
  try {
    await db.one (qry)
    .then ( row => {
      //console.log ( row );
      res.send ( row );
    })
    .catch ( err => {
      //console.log ( err );
      res.send ('ERROR ' + err );
    })
  }
  catch(e) {
    //console.log ('Fehler /api/get/standort: ' + e );
    res.send ('ERROR ' + e );
  }
}); 

//-------------------------------------------------------------------------------------
router.get ('/api/get/vertrag', async (req,res) => {

  try {
    const qry = "SELECT * FROM tb_vertrag WHERE id = " + req.query.id;
    //console.log (qry);
 
    await db.one ( qry )
      .then (row => {
        // console.log ( row );
        res.send (row);
      })
      .catch ( err => {
        res.send ( err );
      })
  }
  catch(error) {
    //console.log ('ERROR: ' + error);
    res.send ("ERROR: " + error);
  }
});

//-----------------------------------------------------------------------------------
//  alle kunden holen
//
router.get ('/api/get/kunden', async (req, res) => {

  try {
    const qry = "SELECT * FROM tb_kunden";

    await db.manyOrNone (qry)
      .then ( kunden => {
        //console.log ( kunden );
        res.send ( kunden );
      })
      .catch (err => {
        res.send ('ERROR: ' + err );
      })
  }
  catch(e) {
    //console.log ('Fehler /api/get/kunden: ' + e );
    res.end ('ERROR');
  }
}); 

//-----------------------------------------------------------------------------------
//  einen kunden holen, parameter = id
//
router.get ('/api/get/kunde', async (req, res) => {

  try {
    const qry = "SELECT * FROM tb_kunden WHERE id = " + req.query.id;
    //console.log ( qry );

    await db.one (qry)
      .then ( kunde => {
        //console.log ( kunde );
        res.send ( kunde );
      })
      .catch (err => {
        res.send ('ERROR: ' + err );
      })
  }
  catch(e) {
    //console.log ('Fehler /api/get/kunden: ' + e );
    res.end ('ERROR');
  }
}); 



//-------------------------------------------------------------------------------------
//  Suchen -- nach Muster = qry
//
router.get ('/api/search/kunden', async (req,res) => {

  try {
    let search = req.query.qry;
    const qry = sprintf ( "SELECT id, name FROM tb_kunden WHERE LOWER(name) LIKE \'%%%s%%\'", search );
    //console.log ( qry );

    await db.any (qry)
    .then (rows => {
      //console.log (rows.length);
      res.send (rows);
    })
    .catch (err => {
      res.send ('ERROR: ' + err );
    })
}
  catch(error) {
    //console.log ( qry );
    //console.log ('ERROR: ' + error);
    res.send ('ERROR: ' + error);
  }
});

//
// Vertragsart holen , parameter = id
router.get ('/api/get/vart', async (req, res) => {

  try {
    const qry = "SELECT * FROM tb_vertragsart WHERE id = " + req.query.id;
    console.log (qry);

    await db.one (qry)
      .then ( art => {
        //console.log ( art );
        res.send ( art );
      })
      .catch (err => {
        res.send ('ERROR: ' + err );
      })
  }
  catch(e) {
    //console.log ('Fehler /api/get/kunden: ' + e );
    res.send ('ERROR ' + e);
  }

});

// Vertragsart suchen , parameter = qry
router.get ('/api/search/vart', async (req, res) => {

  try {
    let search = req.query.qry;
    const qry = sprintf ( "SELECT id, name FROM tb_vertragsart WHERE LOWER(name) LIKE \'%%%s%%\'", search );

    await db.any (qry)
    .then (rows => {
      //console.log (rows.length);
      res.send (rows);
    })
    .catch (err => {
      res.send ('ERROR: ' + err );
    })

  }
  catch {
    //console.log ( qry );
    //console.log ('ERROR: ' + error);
    res.send ('ERROR: ' + error);
  }
});

// Vertragsnummer suchen, parameter = qry
router.get ( "/api/search/vnummer", async (req,res) => {

  try {
    let search = req.query.qry;
    const qry = sprintf ( "SELECT id, nummer FROM tb_vertrag WHERE LOWER(nummer) LIKE \'%%%s%%\'", search );

    await db.any (qry)
    .then (rows => {
      res.send (rows);
    })
    .catch (err => {
      res.send ('ERROR: ' + err );
    })    
  }
  catch {
    //console.log ('ERROR: ' + error);
    res.send ('ERROR: ' + error);
  }
}); 
  


//-------------------------------------------------------------------------------------
//  POST
//-------------------------------------------------------------------------------------

router.post ('/api/post/vertrag', async (req, res) => {

  try {

    let vertrag = req.body.data;
    //console.log (vertrag);

    // neuer Kunde ?
    if ( vertrag.IdKunde === -1 ) {

      //console.log ('INSERT INTO tb_kunden');
      const qry = "INSERT INTO tb_kunden ( name, nummer, strasse, plzort, telefon, fax, mail )" +
                  "VALUES ( $1, $2, $3, $4, $5, $6, $7) RETURNING id";
      await db.one ( qry, [
                    vertrag.KName,
                    vertrag.KNummer,
                    vertrag.KStrasse,
                    vertrag.KPlzOrt,
                    vertrag.KTel,
                    vertrag.KFax,
                    vertrag.KMail
                ])
      .then ( data => {
        vertrag.IdKunde = data.id;
        //console.log ( "data: " + data );
        //console.log ( "vertrag: " + vertrag );
       //res.send ( 'OK');
      })
      .catch (error => {
        //console.log ( "ERROR Kundeinsert");
        //console.log (error);
        res.send ("ERROR Kundeinsert");
      })
    }
    //---- neue Art?
    if ( vertrag.IdArt === -1 ) {
      //console.log ('INSERT INTO tb_vertragsart');

      const qry3 = "INSERT INTO tb_vertragsart ( name ) VALUES ( $1 ) RETURNING id";
      await db.one ( qry3, [ vertrag.Art ])
      .then (data => {
        vertrag.IdArt = data.id;
      })
      .catch ( error => {
        //console.log ( "ERROR Vertragsartinsert");
        //console.log (error);
        res.send ("ERROR Vertragsartinsert");
      })
    }

    //-- Kosten berechnen

    let kosten, faktor, stat = 3;

    if ( vertrag.ZahlungMon !== 0) {
      faktor = 12;
      kosten = vertrag.ZahlungMon;
    }
    else if ( vertrag.ZahlungphalbA !== 0) {
      faktor = 2;
      kosten = vertrag.ZahlungphalbA;
    }
    else if ( vertrag.ZahlungpviertelA !== 0) {
      faktor = 4;
      kosten = vertrag.ZahlungpviertelA;
    }
    else if ( vertrag.ZahlungpA !== 0) {
      faktor = 1;
      kosten = vertrag.ZahlungpA;
    }

    // console.log (vertrag);


    // --- jetzt der Vertrag 
    if ( vertrag.Id  === -1 ) {

      //console.log ("INSERT INTO tb_vertrag");
      //console.log ( "IdKunde: " + vertrag.IdKunde );

      const insertqry = "INSERT INTO tb_vertrag ( nummer, id_kunde, id_standort, id_vertragsart, betrag, faktor, " +
                  "start, laufzeit, kuefrist, vorlauf, " + 
                  "kueinfo, flag, pfad, file, sonstiges, lastmod) " +
                  "VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16 ) " +
                  "RETURNING id";
      await db.one ( insertqry, [
                   vertrag.VertragsNummer,
                   vertrag.IdKunde,
                   vertrag.IdStandort,
                   vertrag.IdArt,
                   kosten,
                   faktor,   
                   vertrag.VStart,
                   vertrag.VLaufzeit,
                   vertrag.KueFrist,
                   vertrag.Vorlauf,
                   vertrag.KueEff,
                   stat,
                   vertrag.Pfad,
                   vertrag.File,
                   vertrag.Sonstiges,
                   'now'
              ])
      .then (data => {
        res.end ('OK - Datensatz mit id ' + data.id.toString() + ' eingefuegt.')
      }) 
      .catch ( error => {
        //console.log ("ERROR Vertrag Insert");
        //console.log (error);
  
        res.send ("ERROR Vertrag Insert");
      })                                 
    }  // update 
    else {
      // Schritt 1 alles updaten
      const updateqry = "UPDATE tb_vertrag SET * WHERE id = " + vertrag.Id;
      await db.one ( updateqry )
      .then ( response => {
        //console.log ( response );
        res.send ('OK');
      })
      .catch ( error => {
        //console.log ( error );
        res.send ( 'ERROR');
      })
    }
  } // try
  catch {
     //console.log ('ERROR try');
     res.send ('ERROR');
  }  
});


// Vertrag rein ..... neu?
/*
if ( vertrag.Id  === -1 ) {

  let kosten, faktor, stat = 3;
  if ( vertrag.ZahlungMon !== 0) {
    faktor = 12;
    kosten = faktor * vertrag.ZahlungMon;
  }
  else if ( vertrag.ZahlungphalbA !== 0) {
    faktor = 2;
    kosten = faktor * vertrag.ZahlungphalbA;
  }
  else if ( vertrag.ZahlungpviertelA !== 0) {
    faktor = 4;
    kosten = faktor * vertrag.ZahlungpviertelA;
  }
  else if ( vertrag.ZahlungpA !== 0) {
    faktor = 1;
    kosten = faktor * vertrag.ZahlungpA;
  }
  console.log (vertrag);
  const qry2 = "INSERT INTO tb_vertrag ( nummer, id_kunde, id_standort, id_vertragsart, betrag, faktor, " +
                "start, laufzeit, kuefrist, vorlauf, " + 
                "kueinfo, flag, pfad, bemerkung, zugriff) " +
                "VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) " +
                "RETURNING id";
  db.one ( qry2, [
                 vertrag.Vertragsnummer,
                 vertrag.IdKunde,
                 vertrag.IdStandort,
                 vertrag.IdArt,
                 kosten,
                 faktor,   
                 vertrag.VStart,
                 vertrag.VLaufzeit,
                 vertrag.KueFrist,
                 vertrag.Vorlauf,
                 vertrag.KueEff,
                 stat,
                 vertrag.File,
                 vertrag.Sonstiges,
                 'now'
            ])
  .then (data => {
    res.end ('OK - Datensatz mit id ' + str(data.id) + ' eingefuegt.')
  }) 
  .catch ( error => {
    console.log ("ERROR Vertrag Insert");
    console.log (error);

    res.send ("ERROR Vertrag Insert");
  })                                 
} else {
  console.log ( 'TODO UPDATE nicht implementiert');
  res.end ( 'TODO UPDATE nicht implementiert');
}
*/

//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//     JOINS TESTEN

router.get ("/api/get/contract", async (req, res) => {

});


router.get ("/api/get/test", async (req,res) => { 
  console.log ( "Wir sind drin " + req );
  res.send ("Hallo");
});

module.exports = router;