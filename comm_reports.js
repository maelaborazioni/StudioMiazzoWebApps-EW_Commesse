/**
 * Ottiene il dataset e quindi il foundset utilizzato per la creazione del report che per ogni fase di ciascuna 
 * commessa e per ciascun periodo mostra le ore lavorate dai dipendenti alla particolare fase
 * 
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} annoDal
 * @param {Number} meseAl
 * @param {Number} annoAl
 * @param {Boolean} [soloConsolidate]
 * @param {Boolean} [soloAutorizzate]
 * @param {Boolean} [soloFatturabili]
 * @param {Array<Number>} [arrIdLavoratoriScelti]
 *  
 * return JSDataSet
 * 
 * @properties={typeid:24,uuid:"171A4823-5D30-46A6-AEF5-67AE3BB31CFD"}
 */
function ottieniDatasetMensileLavoratoriCommesseFasi(arrIdCommesse,meseDal,annoDal,meseAl,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili,arrIdLavoratoriScelti)
{
	// la chiave è la tripla (idlavoratore,periodo,commessa)
	var colNames = ['idlavoratore','codice','nominativo','idditta','cod_ditta','ragione_sociale',
	                'giorno_1','giorno_2','giorno_3','giorno_4','giorno_5','giorno_6','giorno_7','giorno_8','giorno_9','giorno_10',
					'giorno_11','giorno_12','giorno_13','giorno_14','giorno_15','giorno_16','giorno_17','giorno_18','giorno_19','giorno_20',
					'giorno_21','giorno_22','giorno_23','giorno_24','giorno_25','giorno_26','giorno_27','giorno_28','giorno_29','giorno_30',
					'giorno_31','periodo','totale_periodo','commessa','codice_commessa','desc_commessa','fase','codice_fase','desc_fase'];
	
	var periodoDal = annoDal * 100 + meseDal;
	var periodoAl = annoAl * 100 + meseAl;
	
	var ds = databaseManager.createEmptyDataSet(0,colNames);
    if(ds)
    {
    	var currAnno = annoDal;
    	var currMese = meseDal;
    	
    	// ciclo sui periodi da considerare
    	for(var periodo = periodoDal; periodo <= periodoAl; periodo = currAnno * 100 + currMese)
    	{
    		// array di lavoratori associati al periodo corrente
    		/** @type {Array<Number>}*/
    		var arrPeriodo = [];
    		
    		// ciclo sulle commesse richieste
    		for(var comm = 0; comm < arrIdCommesse.length; comm++)
    		{
    			/** @type {Array<Number>}*/
    			var arrFasiCommesse = globals.getArrFasiCommessa([arrIdCommesse[comm]]);
    			
    			for(var cf = 0; cf < arrFasiCommesse.length; cf++)
    			{
	    			// array di lavoratori relativi al periodo ed alla commessa correnti
	    			arrPeriodo = arrIdLavoratoriScelti ? arrIdLavoratoriScelti : globals.getLavoratoriAssociatiFasiCommesse(arrFasiCommesse);
	    			
	    			//ciclo sui lavoratori del periodo e della fase della commessa
			    	for(var l = 0; l < arrPeriodo.length; l++)
			    	{
	    				var arrRow = [];
			    		arrRow.push(arrPeriodo[l]); //idlavoratore
			    		arrRow.push(globals.getCodLavoratore(arrPeriodo[l])); //codice
	                    arrRow.push(globals.getNominativo(arrPeriodo[l])); // nominativo
	                    arrRow.push(globals.getDitta(arrPeriodo[l])); // idditta
	                    arrRow.push(globals.getCodDitta(globals.getDitta(arrPeriodo[l]))); // codice ditta
	                    arrRow.push(globals.getRagioneSociale(globals.getDitta(arrPeriodo[l]))); // ragione sociale
	                    // ciclo su giorni periodo (in numero standard di 31)
	                    var totLav = 0;
	                    var gPeriodo = globals.getTotGiorniMese(currMese,currAnno);
	                    for(var g = 1; g <= 31; g++)
	                    {
	                    	if(g <= gPeriodo)
	                    	{
	                    		var giorno = new Date(currAnno,currMese - 1,g);
		                    	var totOreGiorno = globals.getOreGiornoDipendenteFaseCommessa(arrFasiCommesse[cf]
		                    	                                                              ,arrPeriodo[l]
		                    	                                                              ,giorno
																							  ,soloConsolidate
																							  ,soloAutorizzate
																							  ,soloFatturabili); 
		                        totLav += totOreGiorno;
		                        arrRow.push(totOreGiorno);
	                    	}
	                    	else
	                    		arrRow.push(null);
	                    }
	                    arrRow.push(periodo); //periodo
	                    arrRow.push(totLav); // totale_periodo
	                    
	                    var idCommessa = arrIdCommesse[comm];
						var idCommessaFase = arrFasiCommesse[cf];
						
	                    arrRow.push(idCommessa); // commessa
	                    arrRow.push(globals.getCodiceCommessaDitta(idCommessa)); // codice commessa
	                    arrRow.push(globals.getDescrizioneCommessa(idCommessa)); // descrizione commessa
	                    
	                    arrRow.push(idCommessaFase);
			    		arrRow.push(globals.getCodiceFaseCommessaDitta(idCommessaFase)); //fase commessa
	                    arrRow.push(globals.getDescrizioneFase(idCommessaFase)); //descrizione fase commessa
	                    
	                    ds.addRow(arrRow);
				    	
			    	}
    			}
		    	
		    	// TODO aggiungere riga con totali lavoratori?
    		}
	    	if(currMese != 12)
	    	   currMese++
	    	else
	    	{
	    		currAnno++;
	    		currMese = 1;
	       	}
    	}
    	
    	return ds;
   
    }
    
    return null;
}

/**
 * Ottiene il dataset e quindi il foundset utilizzato per la creazione del report che per ogni commessa
 * e per ciascun periodo mostra le ore lavorate dai dipendenti alla particolare commessa
 * 
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} annoDal
 * @param {Number} meseAl
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 *  
 * return JSDataSet
 * 
 * @properties={typeid:24,uuid:"A65BFF3B-18F0-45A8-B783-8FD4646C40FE"}
 */
function ottieniDatasetMensileLavoratoriCommesse(arrIdCommesse,meseDal,annoDal,meseAl,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	// la chiave è la tripla (idlavoratore,periodo,commessa)
	var colNames = ['idlavoratore','codice','nominativo','idditta','cod_ditta','ragione_sociale',
	                'giorno_1','giorno_2','giorno_3','giorno_4','giorno_5','giorno_6','giorno_7','giorno_8','giorno_9','giorno_10',
					'giorno_11','giorno_12','giorno_13','giorno_14','giorno_15','giorno_16','giorno_17','giorno_18','giorno_19','giorno_20',
					'giorno_21','giorno_22','giorno_23','giorno_24','giorno_25','giorno_26','giorno_27','giorno_28','giorno_29','giorno_30',
					'giorno_31','periodo','totale_periodo','commessa','codice_commessa','desc_commessa'];
	
	var periodoDal = annoDal * 100 + meseDal;
	var periodoAl = annoAl * 100 + meseAl;
	
	var ds = databaseManager.createEmptyDataSet(0,colNames);
    if(ds)
    {
    	var currAnno = annoDal;
    	var currMese = meseDal;
    	    	
		// ciclo sui periodi da considerare
    	for(var periodo = periodoDal; periodo <= periodoAl; periodo = currAnno * 100 + currMese)
    	{
    		// array di lavoratori associati al periodo corrente
    		/** @type {Array<Number>}*/
    		var arrPeriodo = [];
    		
    		// ciclo sulle commesse richieste
    		for(var comm = 0; comm < arrIdCommesse.length; comm++)
    		{    			
    			// array di lavoratori relativi al periodo ed alla commessa correnti
    			arrPeriodo = globals.getLavoratoriAssociatiCommessa(arrIdCommesse[comm]);
    			
    			//ciclo sui lavoratori del periodo e della fase della commessa
		    	for(var l = 0; l < arrPeriodo.length; l++)
		    	{
    				var arrRow = [];
		    		arrRow.push(arrPeriodo[l]); //idlavoratore
		    		arrRow.push(globals.getCodLavoratore(arrPeriodo[l])); //codice
                    arrRow.push(globals.getNominativo(arrPeriodo[l])); // nominativo
                    arrRow.push(globals.getDitta(arrPeriodo[l])); // idditta
                    arrRow.push(globals.getCodDitta(globals.getDitta(arrPeriodo[l]))); // codice ditta
                    arrRow.push(globals.getRagioneSociale(globals.getDitta(arrPeriodo[l]))); // ragione sociale
                    // ciclo su giorni periodo (in numero standard di 31)
                    var totLav = 0;
                    var gPeriodo = globals.getTotGiorniMese(currMese,currAnno);
                    for(var g = 1; g <= 31; g++)
                    {
                    	if(g <= gPeriodo)
                    	{
                    		var giorno = new Date(currAnno,currMese - 1,g);
	                    	var totOreGiorno = globals.getOreGiornoDipendenteCommessa(arrIdCommesse[comm]
	                    	                                                          ,arrPeriodo[l]
	                    	                                                          ,giorno
																					  ,soloConsolidate
																					  ,soloAutorizzate
																					  ,soloFatturabili); 
	                        totLav += totOreGiorno;
	                        arrRow.push(totOreGiorno != 0 ? totOreGiorno : null);
                    	}
                    	else
                    		arrRow.push(null);
                    }
                    arrRow.push(periodo); //periodo
                    arrRow.push(totLav); // totale_periodo
                    
                    var idCommessa = arrIdCommesse[comm];
					
                    arrRow.push(idCommessa); // commessa
                    arrRow.push(globals.getCodiceCommessaDitta(idCommessa)); // codice commessa
                    arrRow.push(globals.getDescrizioneCommessa(idCommessa)); // descrizione commessa
                                        
                    ds.addRow(arrRow);
			    	
		    	}
    			// TODO aggiungere riga con totali lavoratori?
    		}
    		
	    	if(currMese != 12)
	    	   currMese++
	    	else
	    	{
	    		currAnno++;
	    		currMese = 1;
	       	}
    	}
    	
    	return ds;
   
    }
    
    return null;
}

/**
 * Ottiene il dataset relativo alle ore lavorate su commessa, divise per singola commessa,
 * per il dipendente selezionato nel periodo richiesto
 * 
 * @param {Number} idLavoratore
 * @param {Number} meseDal
 * @param {Number} annoDal
 * @param {Number} meseAl
 * @param {Number} annoAl
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"A67CA664-C296-4098-BD1A-F11FB3EBB05B"}
 */
function ottieniDatasetMensileLavoratore(idLavoratore,meseDal,annoDal,meseAl,annoAl)
{
	var giornoDal = new Date(annoDal,meseDal - 1,1); 
	var giornoAl = new Date(annoAl,meseAl - 1,globals.getTotGiorniMese(meseAl,annoAl));
	var dsFasiCommesseLav = globals.getFasiCommesseLavoratore(idLavoratore,giornoDal,giornoAl);
    var arrFasiCommesseLav = dsFasiCommesseLav.getColumnAsArray(1);
	
    var colNames = ['commessa','codice_commessa','desc_commessa','fase','codice_fase','desc_fase','periodo',
				    'giorno_1','giorno_2','giorno_3','giorno_4','giorno_5','giorno_6','giorno_7','giorno_8','giorno_9','giorno_10',
					'giorno_11','giorno_12','giorno_13','giorno_14','giorno_15','giorno_16','giorno_17','giorno_18','giorno_19','giorno_20',
					'giorno_21','giorno_22','giorno_23','giorno_24','giorno_25','giorno_26','giorno_27','giorno_28','giorno_29','giorno_30',
					'giorno_31'];
    var dsLavoratore = databaseManager.createEmptyDataSet(0,colNames);
	    
    for(var c = 0; c < arrFasiCommesseLav.length; c++)
    {
    	var arrRow = [];
    	var idDittaCommessa = globals.getDittaCommessaDaIdFase(arrFasiCommesseLav[c]);
        
        arrRow.push(idDittaCommessa); // commessa
        arrRow.push(globals.getCodiceCommessaDitta(idDittaCommessa)); // codice commessa
        arrRow.push(globals.getDescrizioneCommessa(idDittaCommessa)); // descrizione commessa
        
        arrRow.push(arrFasiCommesseLav[c]); // fase
		arrRow.push(globals.getCodiceFaseCommessaDitta(arrFasiCommesseLav[c])); // fase commessa
        arrRow.push(globals.getDescrizioneFase(arrFasiCommesseLav[c])); //descrizione fase commessa
		
        // ciclo su giorni periodo (in numero standard di 31)
    	for(var g = giornoDal; g <= giornoAl; g = new Date(g.getFullYear(),g.getMonth(),g.getDate() + 1))
    	{    	    	
           	var totOreGiorno = globals.getOreGiornoDipendenteCommessa(idDittaCommessa,arrFasiCommesseLav[c],g); 
           	arrRow.push(totOreGiorno);
    	}
    	
        dsLavoratore.addRow(arrRow);
    }
    
    return dsLavoratore;
}

/**
 * Ottiene il dataset e quindi il foundset utilizzato per la creazione del report che per ciascun mese
 * mostra le ore lavorate sulle particolari fasi delle commesse 
 * 
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} annoDal
 * @param {Number} meseAl
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 *
 * @return JSDataSet
 * 
 * @properties={typeid:24,uuid:"AA90D251-8599-4E11-A77C-F3B6FEAB32C2"}
 */
function ottieniDatasetMensileCommesseFasi(arrIdCommesse,meseDal,annoDal,meseAl,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	var colNames = [//'idditta','cod_ditta','ragione_sociale',
	                'giorno_1','giorno_2','giorno_3','giorno_4','giorno_5','giorno_6','giorno_7','giorno_8','giorno_9','giorno_10',
					'giorno_11','giorno_12','giorno_13','giorno_14','giorno_15','giorno_16','giorno_17','giorno_18','giorno_19','giorno_20',
					'giorno_21','giorno_22','giorno_23','giorno_24','giorno_25','giorno_26','giorno_27','giorno_28','giorno_29','giorno_30',
					'giorno_31','periodo','totale_periodo','commessa','codice_commessa','desc_commessa','fase','codice_fase','desc_fase'];
	
	var periodoDal = annoDal * 100 + meseDal;
	var periodoAl = annoAl * 100 + meseAl;
	
	var ds = databaseManager.createEmptyDataSet(0,colNames);
	if(ds)
    {
    	var currAnno = annoDal;
    	var currMese = meseDal;
    	
    	// ciclo sui periodi da considerare
    	for(var periodo = periodoDal; periodo <= periodoAl; periodo = currAnno * 100 + currMese)
    	{
    		var arrIdCommesseFasi = globals.getArrFasiCommessa(arrIdCommesse);
    		
    		// ciclo sulle fasid delle commesse richieste
    		for(var comm = 0; comm < arrIdCommesseFasi.length; comm++)
    		{
    			var arrRow = [];
//	    		arrRow.push(arrDitte[d]); // idditta
//              arrRow.push(globals.getCodDitta(arrDitte[d])); // codice ditta
//              arrRow.push(globals.getRagioneSociale(arrDitte[d])); // ragione sociale
                    			
    			// ciclo su giorni periodo (in numero standard di 31)
                var totLav = 0;
                var gMese = globals.getTotGiorniMese(currMese,currAnno);
                for(var g = 1; g <= 31; g++)
                {
                	if(g <= gMese)
                	{
                		var giorno = new Date(currAnno,currMese - 1,g);
                        var totOreGiorno = globals.getTotaleOreLavorateSuFaseCommessa(arrIdCommesseFasi[comm]
                                                                                      ,giorno
																					  ,giorno
																					  ,soloConsolidate
																					  ,soloAutorizzate
																					  ,soloFatturabili); 
                        totLav += totOreGiorno;
                        arrRow.push(totOreGiorno);
                	}
                	else
                	    arrRow.push(null);
                }
                
                arrRow.push(periodo); //periodo
                arrRow.push(totLav); // totale_periodo
                
                var idDittaCommessa = globals.getDittaCommessaDaIdFase(arrIdCommesseFasi[comm]);
                
                arrRow.push(idDittaCommessa); // commessa
                arrRow.push(globals.getCodiceCommessaDitta(idDittaCommessa)); // codice commessa
                arrRow.push(globals.getDescrizioneCommessa(idDittaCommessa)); // descrizione commessa
                
                arrRow.push(arrIdCommesseFasi[comm]); // fase
	    		arrRow.push(globals.getCodiceFaseCommessaDitta(arrIdCommesseFasi[comm])); // fase commessa
                arrRow.push(globals.getDescrizioneFase(arrIdCommesseFasi[comm])); //descrizione fase commessa
	    		
                ds.addRow(arrRow);
	    				    	
    		}
	    	if(currMese != 12)
	    	   currMese++
	    	else
	    	{
	    		currAnno++;
	    		currMese = 1;
	       	}
    	}
    	return ds;
    }
    
    return null;
}

/**
 * Ottiene il dataset e quindi il foundset utilizzato per la creazione del report che per ciascun mese
 * mostra le ore lavorate sulla particolare commessa 
 * 
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} annoDal
 * @param {Number} meseAl
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 *
 * @return JSDataSet
 * 
 * @properties={typeid:24,uuid:"75884BEB-F6C5-45BE-BF5C-572DF7AA25AD"}
 */
function ottieniDatasetMensileCommesse(arrIdCommesse,meseDal,annoDal,meseAl,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	var colNames = [//'idditta','cod_ditta','ragione_sociale',
	                'giorno_1','giorno_2','giorno_3','giorno_4','giorno_5','giorno_6','giorno_7','giorno_8','giorno_9','giorno_10',
					'giorno_11','giorno_12','giorno_13','giorno_14','giorno_15','giorno_16','giorno_17','giorno_18','giorno_19','giorno_20',
					'giorno_21','giorno_22','giorno_23','giorno_24','giorno_25','giorno_26','giorno_27','giorno_28','giorno_29','giorno_30',
					'giorno_31','periodo','totale_periodo','commessa','codice_commessa','desc_commessa'];
	
	var periodoDal = annoDal * 100 + meseDal;
	var periodoAl = annoAl * 100 + meseAl;
	
	var ds = databaseManager.createEmptyDataSet(0,colNames);
	if(ds)
    {
    	var currAnno = annoDal;
    	var currMese = meseDal;
    	
    	// ciclo sui periodi da considerare
    	for(var periodo = periodoDal; periodo <= periodoAl; periodo = currAnno * 100 + currMese)
    	{
    		// ciclo sulle commesse richieste
    		for(var comm = 0; comm < arrIdCommesse.length; comm++)
    		{
    			var arrRow = [];
//	    		arrRow.push(arrDitte[d]); // idditta
//              arrRow.push(globals.getCodDitta(arrDitte[d])); // codice ditta
//              arrRow.push(globals.getRagioneSociale(arrDitte[d])); // ragione sociale
                
    			// ciclo su giorni periodo (in numero standard di 31)
                var totLav = 0;
                var gMese = globals.getTotGiorniMese(currMese,currAnno);
                for(var g = 1; g <= 31; g++)
                {
                	if(g <= gMese)
                	{
                		var giorno = new Date(currAnno,currMese - 1,g);
	                    var totOreGiorno = globals.getTotaleOreLavorateSuCommessa(arrIdCommesse[comm]
	                                                                              ,giorno
																				  ,giorno
																				  ,soloConsolidate
																				  ,soloAutorizzate
																				  ,soloFatturabili); 
	                    totLav += totOreGiorno;
	                    arrRow.push(totOreGiorno);
                	}
                	else
                		arrRow.push(null);
                }
                arrRow.push(periodo); //periodo
                arrRow.push(totLav); // totale_periodo
                arrRow.push(arrIdCommesse[comm]); // commessa
                arrRow.push(globals.getCodiceCommessaDitta(arrIdCommesse[comm])); // codice commessa
                arrRow.push(globals.getDescrizioneCommessa(arrIdCommesse[comm])); // descrizione commessa
	    		
                ds.addRow(arrRow);
	    				    	
    		}
	    	if(currMese != 12)
	    	   currMese++
	    	else
	    	{
	    		currAnno++;
	    		currMese = 1;
	       	}
    	}
    	return ds;
    }
    
    return null;
}

/**
 * Restituisce il dataset con i dati relativi alle somme delle ore
 * su commesse nel periodo indicato
 * 
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrIdDittaCliente]
 *
 * @properties={typeid:24,uuid:"7E2B459B-342D-4A49-A695-8C4106051DDB"}
 */
function ottieniDatasetRiepilogoOreDalAl(dal,al,arrIdDittaCliente)
{
	var sql = "SELECT \
  D.Codice AS CodiceCliente \
  ,D.RagioneSociale AS Cliente \
  ,DC.Codice AS CodiceCommessa \
  ,DC.Descrizione AS DescrizioneCommessa \
  ,CONVERT(varchar(10),DC.InizioValidita,103) AS InizioValidita \
  ,CONVERT(varchar(10),DC.FineValidita,103) AS FineValidita \
  ,DC.MonteOre AS MonteOreCommessa \
  ,SUM(CGO.Ore) AS OrePianificate \
  ,SUM(CASE CGO.Consolidato \
       WHEN 1 \
	   THEN CGO.Ore \
	   ELSE 0 \
	   END) AS OreLavorate \
  ,SUM(CASE CGO.Autorizzato \
       WHEN 1 \
	   THEN CGO.Ore \
	   ELSE 0 \
	   END) AS Autorizzate \
  ,SUM(CASE CGO.Billable \
       WHEN 1 \
	   THEN CGO.Ore \
	   ELSE 0 \
	   END) AS DaFatturare \
  FROM \
    Commesse_Giornaliera_Ore CGO \
	INNER JOIN Commesse_Giornaliera CG \
	ON CGO.idCommessaGiornaliera = CG.idCommessaGiornaliera \
	INNER JOIN Ditte_Commesse_Fasi DCF \
	ON CG.idDittaCommessaFase = DCF.idDittaCommessaFase \
	INNER JOIN Ditte_Commesse DC \
	ON DCF.idDittaCommessa = DC.idDittaCommessa \
	INNER JOIN Ditte D \
	ON DC.idDitta = D.idDitta \
	INNER JOIN Lavoratori L \
	ON CG.idLavoratore = L.idLavoratore \
  WHERE \
   CG.Giorno BETWEEN ? AND ? ";
	
	sql += arrIdDittaCliente ? (" AND D.idDitta IN ( " + arrIdDittaCliente.map(function(id){return id}).join(',') + ")") : "";
	sql += " GROUP BY \
            D.idDitta \
			,D.Codice \
			,D.RagioneSociale \
			,DC.idDittaCommessa \
			,DC.Codice \
			,DC.Descrizione \
			,DC.MonteOre \
			,DC.InizioValidita \
            ,DC.FineValidita";
	
	var arr = [dal,al];
	var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sql,arr,-1);
	
	return ds;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} arrIdDittaCliente
 *
 * @properties={typeid:24,uuid:"81B6D8BE-1134-4BA2-B1A9-44BD60CFC1B3"}
 */
function ottieniDatasetRiepilogoOreDalAlFatturazione(dal,al,arrIdDittaCliente)
{
	var sql = "SELECT \
  D.Codice AS CodiceCliente \
  ,D.RagioneSociale AS Cliente \
  ,DC.Codice AS CodiceCommessa \
  ,DC.Descrizione AS DescrizioneCommessa \
  ,SUM(CASE CGO.Billable \
       WHEN 1 \
	   THEN CGO.Ore \
	   ELSE 0 \
	   END) AS DaFatturare \
  FROM \
    Commesse_Giornaliera_Ore CGO \
	INNER JOIN Commesse_Giornaliera CG \
	ON CGO.idCommessaGiornaliera = CG.idCommessaGiornaliera \
	INNER JOIN Ditte_Commesse_Fasi DCF \
	ON CG.idDittaCommessaFase = DCF.idDittaCommessaFase \
	INNER JOIN Ditte_Commesse DC \
	ON DCF.idDittaCommessa = DC.idDittaCommessa \
	INNER JOIN Ditte D \
	ON DC.idDitta = D.idDitta \
	INNER JOIN Lavoratori L \
	ON CG.idLavoratore = L.idLavoratore \
  WHERE \
   CG.Giorno BETWEEN ? AND ? ";
  sql += arrIdDittaCliente ? (" AND D.idDitta IN ( " + arrIdDittaCliente.map(function(id){return id}).join(',') + ")") : "";
  sql += " GROUP BY \
            D.Codice \
			,D.RagioneSociale \
			,DC.Codice \
			,DC.Descrizione \
			";
	
	var arr = [dal,al];
	var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sql,arr,-1);
	
	return ds;
}

/**
 * Restituisce il dataset con i dati relativi alle somme delle ore
 * sulle fasi delle commesse nel periodo indicato
 * 
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrIdDittaCliente]
 *
 * @properties={typeid:24,uuid:"C5B184F9-84E0-4FDB-A3F9-7E74CCD73159"}
 */
function ottieniDatasetRiepilogoOreFaseDalAl(dal,al,arrIdDittaCliente)
{
	var sql = "SELECT \
  D.Codice AS CodiceCliente \
  ,D.RagioneSociale AS Cliente \
  ,DC.Codice AS CodiceCommessa \
  ,DC.Descrizione AS DescrizioneCommessa \
  ,CONVERT(varchar(10),DC.InizioValidita,103) AS InizioValidita \
  ,CONVERT(varchar(10),DC.FineValidita,103) AS FineValidita \
  ,DC.MonteOre AS MonteOreCommessa \
  ,DCF.CodiceFase \
  ,DCF.DescrizioneFase \
  ,CONVERT(varchar(10),DCF.InizioValiditaFase,103) AS InizioValiditaFase \
  ,CONVERT(varchar(10),DCF.FineValiditaFase,103) AS FineValiditaFase \
  ,DCF.MonteOreFase \
  ,SUM(CGO.Ore) AS Pianificate \
  ,SUM(CASE CGO.Consolidato \
       WHEN 1 \
	   THEN CGO.Ore \
	   ELSE 0 \
	   END) AS OreLavorate \
  ,SUM(CASE CGO.Autorizzato \
       WHEN 1 \
	   THEN CGO.Ore \
	   ELSE 0 \
	   END) AS Autorizzate \
  ,SUM(CASE CGO.Billable \
       WHEN 1 \
	   THEN CGO.Ore \
 	   ELSE 0 \
	   END) AS DaFatturare \
  FROM \
    Commesse_Giornaliera_Ore CGO \
	INNER JOIN Commesse_Giornaliera CG \
	ON CGO.idCommessaGiornaliera = CG.idCommessaGiornaliera \
	INNER JOIN Ditte_Commesse_Fasi DCF \
	ON CG.idDittaCommessaFase = DCF.idDittaCommessaFase \
	INNER JOIN Ditte_Commesse DC \
	ON DCF.idDittaCommessa = DC.idDittaCommessa \
	INNER JOIN Ditte D \
	ON DC.idDitta = D.idDitta \
	INNER JOIN Lavoratori L \
	ON CG.idLavoratore = L.idLavoratore \
  WHERE \
   CG.Giorno BETWEEN ? AND ? ";
	
	sql +=	arrIdDittaCliente ? (" AND D.idDitta IN ( " + arrIdDittaCliente.map(function(id){return id}).join(',') + ")") : "";
	sql += " GROUP BY \
            D.idDitta \
			,D.Codice \
			,D.RagioneSociale \
			,DC.idDittaCommessa \
			,DC.Codice \
			,DC.Descrizione \
			,DC.MonteOre \
			,DC.InizioValidita \
            ,DC.FineValidita \
			,DCF.CodiceFase \
			,DCF.DescrizioneFase \
			,DCF.InizioValiditaFase \
			,DCF.FineValiditaFase \
			,DCF.MonteOreFase"
	
	var arr = [dal,al];
	var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sql,arr,-1);
	
	return ds;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrIdDittaCliente]
 *
 * @properties={typeid:24,uuid:"57F137E5-7DBF-42E2-AAEF-EB5532E71356"}
 */
function ottieniDatasetRiepilogoOreFaseDalAlFatturazione(dal,al,arrIdDittaCliente)
{
	var sql = "SELECT \
  D.Codice AS CodiceCliente \
  ,D.RagioneSociale AS Cliente \
  ,DC.Codice AS CodiceCommessa \
  ,DC.Descrizione AS DescrizioneCommessa \
  ,DCF.CodiceFase \
  ,DCF.DescrizioneFase \
  ,SUM(CASE CGO.Billable \
       WHEN 1 \
	   THEN CGO.Ore \
 	   ELSE 0 \
	   END) AS DaFatturare \
  FROM \
    Commesse_Giornaliera_Ore CGO \
	INNER JOIN Commesse_Giornaliera CG \
	ON CGO.idCommessaGiornaliera = CG.idCommessaGiornaliera \
	INNER JOIN Ditte_Commesse_Fasi DCF \
	ON CG.idDittaCommessaFase = DCF.idDittaCommessaFase \
	INNER JOIN Ditte_Commesse DC \
	ON DCF.idDittaCommessa = DC.idDittaCommessa \
	INNER JOIN Ditte D \
	ON DC.idDitta = D.idDitta \
	INNER JOIN Lavoratori L \
	ON CG.idLavoratore = L.idLavoratore \
  WHERE \
   CG.Giorno BETWEEN ? AND ? ";
	
	sql += arrIdDittaCliente ? (" AND D.idDitta IN ( " + arrIdDittaCliente.map(function(id){return id}).join(',') + ")") : "";
	sql += " GROUP BY \
            D.Codice \
			,D.RagioneSociale \
			,DC.Codice \
			,DC.Descrizione \
			,DCF.CodiceFase \
			,DCF.DescrizioneFase \
			"
	
	var arr = [dal,al];
	var ds = databaseManager.getDataSetByQuery(globals.Server.MA_PRESENZE,sql,arr,-1);
	
	return ds;
}

/**
 * Crea il report con le ore lavorate ogni giorno sulle diverse fasi delle commesse nei periodi selezionati
 *
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} meseAl
 * @param {Number} annoDal
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 * 
 * @properties={typeid:24,uuid:"160B793A-6793-4D7C-84ED-E3EBE74EA9C7"}
 */
function exportReportMensileLavoratoriCommesseFasi(arrIdCommesse,meseDal,meseAl,annoDal,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	// ottenimento del dataset
	var ds = ottieniDatasetMensileLavoratoriCommesseFasi(arrIdCommesse
		                                                 ,meseDal
														 ,annoDal
														 ,meseAl
														 ,annoAl
														 ,soloConsolidate
														 ,soloAutorizzate
														 ,soloFatturabili);
	
	// definizione dei types associati alle colonne del dataset
	var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,
			     JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT];
	
	// creazione foundset corrispondente
	var fs = databaseManager.getFoundSet(ds.createDataSource('dS_MensileLavoratoriCommesseFasi',types));
	fs.loadAllRecords();
	
	var reportParams = new Object();
	var periodoDal = annoDal * 100 + meseDal;
	var periodoAl = annoAl * 100  + meseAl;
	reportParams.pdalperiodo = periodoDal;
	reportParams.palperiodo = periodoAl;
	
	var bytes = plugins.jasperPluginRMI.runReport(fs,'COMM_CommesseLavoratori_Fasi.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams,null);

	plugins.file.writeFile('Lavoratori_Commesse_Fasi_Dal_' + periodoDal + '_Al_' + periodoAl +'.pdf',bytes);
}

/**
 * Crea il report con le ore lavorate ogni giorno sulle diverse commesse nei diversi periodi
 *
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} meseAl
 * @param {Number} annoDal
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 * 
 * @properties={typeid:24,uuid:"93F83C7C-0BFB-45F5-906C-9C03DC2959D3"}
 */
function exportReportMensileLavoratoriCommesse(arrIdCommesse,meseDal,meseAl,annoDal,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	// ottenimento del dataset
	var ds = ottieniDatasetMensileLavoratoriCommesse(arrIdCommesse
		                                             ,meseDal
													 ,annoDal
													 ,meseAl
													 ,annoAl
													 ,soloConsolidate
													 ,soloAutorizzate
													 ,soloFatturabili);
	
	// definizione dei types associati alle colonne del dataset
	var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,
			     JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT];
	
	// creazione foundset corrispondente
	var fs = databaseManager.getFoundSet(ds.createDataSource('dS_MensileLavoratoriCommesse',types));
	fs.loadAllRecords();
	
	var reportParams = new Object();
	var periodoDal = annoDal * 100 + meseDal;
	var periodoAl = annoAl * 100  + meseAl;
	reportParams.pdalperiodo = periodoDal;
	reportParams.palperiodo = periodoAl;
	
	var bytes = plugins.jasperPluginRMI.runReport(fs,'COMM_CommesseLavoratori.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams,null);

	plugins.file.writeFile('Lavoratori_Commesse_Dal_' + periodoDal + '_Al_' + periodoAl +'.pdf',bytes);
}

/**
 * Crea il report con le ore lavorate su ogni singola commessa dal lavoratore selezionato 
 * nei giorni del periodo richiesto
 *  
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 *
 * @return {Array<byte>}
 * 
 * @properties={typeid:24,uuid:"5931EB15-A6DE-4C1B-B839-7EC2926E7875"}
 */
function createReportMensileLavoratore(idLavoratore,dal,al)
{
	var arrIdCommesse = globals.getCommesseLavoratore(idLavoratore,dal,al).getColumnAsArray(1);
	var meseDal = dal.getMonth() + 1;
	var meseAl = al.getMonth() + 1;
	var annoDal = dal.getFullYear();
	var annoAl = al.getFullYear();
	
	// ottenimento del dataset
	var ds = ottieniDatasetMensileLavoratoriCommesseFasi(arrIdCommesse
		                                                 ,meseDal
														 ,annoDal
														 ,meseAl
														 ,annoAl
														 ,null
														 ,null
														 ,null,
														 [idLavoratore]);
	
	// definizione dei types associati alle colonne del dataset
	var types = [JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,
			     JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
				 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT];

	
	// creazione foundset corrispondente
	var fs = databaseManager.getFoundSet(ds.createDataSource('dS_MensileLavoratore_' + idLavoratore,types));
	fs.loadAllRecords();
	
	var reportParams = new Object();
	var periodoDal = annoDal * 100 + meseDal;
	var periodoAl = annoAl * 100  + meseAl;
	reportParams.pdalperiodo = periodoDal;
	reportParams.palperiodo = periodoAl;
	reportParams.pcodice = globals.getCodLavoratore(idLavoratore);
	reportParams.pnominativo = globals.getNominativo(idLavoratore);
	
	var bytes = plugins.jasperPluginRMI.runReport(fs,'COMM_Lavoratore.jasper',false,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams,null);

	return bytes;

}
/**
 * Crea il report con le ore totali lavorate sulle diverse commesse nei diversi periodi indicati
 *
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} meseAl
 * @param {Number} annoDal
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 * 
 * @properties={typeid:24,uuid:"01008438-E7D6-420B-B6EB-D52289E7EE74"}
 */
function exportReportMensileCommesseFasi(arrIdCommesse,meseDal,meseAl,annoDal,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	// ottenimento del dataset
	var ds = ottieniDatasetMensileCommesseFasi(arrIdCommesse,meseDal,annoDal,meseAl,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
	
	// definizione dei types associati alle colonne del dataset
	var types = [//JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,
                 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT];
		
	// creazione foundset corrispondente
	var fs = databaseManager.getFoundSet(ds.createDataSource('dS_MensileCommesseFasi',types));
    fs.loadAllRecords();
    
    var reportParams = new Object();
	var periodoDal = annoDal * 100 + meseDal;
	var periodoAl = annoAl * 100  + meseAl;
	reportParams.pdalperiodo = periodoDal;
	reportParams.palperiodo = periodoAl;
	
	var bytes = plugins.jasperPluginRMI.runReport(fs,'COMM_Commesse_Fasi.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams);

	plugins.file.writeFile('Commesse_Fasi_Dal_'  + periodoDal + '_Al_' + periodoAl + '.pdf',bytes);
}

/**
 * Crea il report con le ore totali lavorate sulle diverse commesse nei diversi periodi indicati
 *
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} meseAl
 * @param {Number} annoDal
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 * 
 * @properties={typeid:24,uuid:"BAA9E027-3A7C-4D20-9F2C-B161FF36E06D"}
 */
function exportReportMensileCommesse(arrIdCommesse,meseDal,meseAl,annoDal,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	// ottenimento del dataset
	var ds = ottieniDatasetMensileCommesse(arrIdCommesse,meseDal,annoDal,meseAl,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
	
	// definizione dei types associati alle colonne del dataset
	var types = [//JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,
                 JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,
	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT];
		
	// creazione foundset corrispondente
	var fs = databaseManager.getFoundSet(ds.createDataSource('dS_MensileCommesse',types));
    fs.loadAllRecords();
    
    var reportParams = new Object();
	var periodoDal = annoDal * 100 + meseDal;
	var periodoAl = annoAl * 100  + meseAl;
	reportParams.pdalperiodo = periodoDal;
	reportParams.palperiodo = periodoAl;
	
	var bytes = plugins.jasperPluginRMI.runReport(fs,'COMM_Commesse.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams);

	plugins.file.writeFile('Commesse_Dal_'  + periodoDal + '_Al_' + periodoAl + '.pdf',bytes);
}

/**
 * Crea il report con le ore lavorate ogni giorno sulle diverse fasi delle commesse nei diversi periodi
 * 
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} meseAl
 * @param {Number} annoDal
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 *
 * @properties={typeid:24,uuid:"2A747CF1-B0EE-4901-8697-FD27A4B43BFB"}
 */
function createExcelMensileLavoratoriCommesseFasi(arrIdCommesse,meseDal,meseAl,annoDal,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	try
	{
		var fileName = ['Lavoratori_Commesse', 'Dal', annoDal * 100 + meseDal, 'Al' , annoAl * 100 + meseAl].join('_') + '.xls';
		var localFile = true;
		/** @type {Array<byte>} */
		var output = [];
		var result = [];
		
		var template = plugins.file.readFile('C:/Report/COMM_LavoratoriCommesse_Fasi.xls');
		
		var ds = ottieniDatasetMensileLavoratoriCommesseFasi(arrIdCommesse
			                                                 ,meseDal
															 ,annoDal
															 ,meseAl
															 ,annoAl
															 ,soloConsolidate
															 ,soloAutorizzate
															 ,soloFatturabili);
		
		var colNames = ['idlavoratore','codice','nominativo','idditta','cod_ditta','ragione_sociale',
				        'giorno_1','giorno_2','giorno_3','giorno_4','giorno_5','giorno_6','giorno_7','giorno_8','giorno_9','giorno_10',
						'giorno_11','giorno_12','giorno_13','giorno_14','giorno_15','giorno_16','giorno_17','giorno_18','giorno_19','giorno_20',
						'giorno_21','giorno_22','giorno_23','giorno_24','giorno_25','giorno_26','giorno_27','giorno_28','giorno_29','giorno_30',
						'giorno_31','periodo','totale_periodo','commessa','codice_commessa','desc_commessa','fase','codice_fase','desc_fase'];
		
		result = globals.xls_export(ds,fileName,localFile,false,false,null,'Commesse lavoratori',template,colNames);
		ds.removeRow(-1);
		
		output = (result.length > 0 && result) || output;
		
		if(!output)
			return false;
		
		plugins.file.writeFile(fileName,output);
	}
    catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		return false;
	}
	finally
	{
		return true;
	}
}

/**
 * Crea il report con le ore lavorate ogni giorno sulle diverse commesse nei diversi periodi
 * 
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} meseAl
 * @param {Number} annoDal
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 *
 * @properties={typeid:24,uuid:"142FBE6C-0DAB-47D2-90DE-041B46636510"}
 */
function createExcelMensileLavoratoriCommesse(arrIdCommesse,meseDal,meseAl,annoDal,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	try
	{
		var fileName = ['Lavoratori_Commesse', 'Dal', annoDal * 100 + meseDal, 'Al' , annoAl * 100 + meseAl].join('_') + '.xls';
		var localFile = true;
		/** @type {Array<byte>} */
		var output = [];
		var result = [];
		
		var template = plugins.file.readFile('C:/Report/COMM_LavoratoriCommesse.xls');
		
		var ds = ottieniDatasetMensileLavoratoriCommesse(arrIdCommesse
			                                             ,meseDal
														 ,annoDal
														 ,meseAl
														 ,annoAl
														 ,soloConsolidate
														 ,soloAutorizzate
														 ,soloFatturabili);
		
		var colNames = ['idlavoratore','codice','nominativo','idditta','cod_ditta','ragione_sociale',
				        'giorno_1','giorno_2','giorno_3','giorno_4','giorno_5','giorno_6','giorno_7','giorno_8','giorno_9','giorno_10',
						'giorno_11','giorno_12','giorno_13','giorno_14','giorno_15','giorno_16','giorno_17','giorno_18','giorno_19','giorno_20',
						'giorno_21','giorno_22','giorno_23','giorno_24','giorno_25','giorno_26','giorno_27','giorno_28','giorno_29','giorno_30',
						'giorno_31','periodo','totale_periodo','commessa','codice_commessa','desc_commessa'];
		
		result = globals.xls_export(ds,fileName,localFile,false,false,null,'Commesse lavoratori',template,colNames);
		ds.removeRow(-1);
		
		output = (result.length > 0 && result) || output;
		
		if(!output)
			return false;
		
		plugins.file.writeFile(fileName,output);
		return true;
	}
    catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		return false;
	}
	finally
	{
		
	}
}

/**
 * Crea il foglio di calcolo con le ore totali lavorate sulle diverse commesse nei mesi indicati
 * 
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} meseAl
 * @param {Number} annoDal
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 * 
 * @properties={typeid:24,uuid:"85CB3BCF-EB60-43D4-8A9A-586D4CC76897"}
 */
function createExcelMensileCommesseFasi(arrIdCommesse,meseDal,meseAl,annoDal,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	try
	{
		var fileName = ['Lavoratori_Commesse', 'Dal', annoDal * 100 + meseDal, 'Al' , annoAl * 100 + meseAl].join('_') + '.xls';
		var localFile = true;
		/** @type {Array<byte>} */
		var output = [];
		var result = [];
		
		var template = plugins.file.readFile('C:/Report/COMM_Commesse.xls');
		
		var ds = ottieniDatasetMensileCommesseFasi(arrIdCommesse,meseDal,annoDal,meseAl,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
		
		var colNames = [//'idditta','cod_ditta','ragione_sociale',
					    'giorno_1','giorno_2','giorno_3','giorno_4','giorno_5','giorno_6','giorno_7','giorno_8','giorno_9','giorno_10',
						'giorno_11','giorno_12','giorno_13','giorno_14','giorno_15','giorno_16','giorno_17','giorno_18','giorno_19','giorno_20',
						'giorno_21','giorno_22','giorno_23','giorno_24','giorno_25','giorno_26','giorno_27','giorno_28','giorno_29','giorno_30',
						'giorno_31','periodo','totale_periodo','commessa','codice_commessa','desc_commessa','fase','codice_fase','desc_fase'];
		
		result = globals.xls_export(ds,fileName,localFile,false,false,null,'Commesse',template,colNames);
		ds.removeRow(-1);
		
		output = (result.length > 0 && result) || output;
		
		if(!output)
			return false;
		
		plugins.file.writeFile(fileName,output);
		return true;
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		return false;
	}
	finally
	{
		
	}
}

/**
 * Crea il foglio di calcolo con le ore totali lavorate sulle diverse commesse nei mesi indicati
 * 
 * @param {Array<Number>} arrIdCommesse
 * @param {Number} meseDal
 * @param {Number} meseAl
 * @param {Number} annoDal
 * @param {Number} annoAl
 * @param {Boolean} soloConsolidate
 * @param {Boolean} soloAutorizzate
 * @param {Boolean} soloFatturabili
 * 
 * @properties={typeid:24,uuid:"A90002AA-65A6-43E0-843A-EFEBA2DEFF2C"}
 */
function createExcelMensileCommesse(arrIdCommesse,meseDal,meseAl,annoDal,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili)
{
	try
	{
		var fileName = ['Lavoratori_Commesse', 'Dal', annoDal * 100 + meseDal, 'Al' , annoAl * 100 + meseAl].join('_') + '.xls';
		var localFile = true;
		/** @type {Array<byte>} */
		var output = [];
		var result = [];
		
		var template = plugins.file.readFile('C:/Report/COMM_Commesse.xls');
		
		var ds = ottieniDatasetMensileCommesse(arrIdCommesse,meseDal,annoDal,meseAl,annoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
		
		var colNames = [//'idditta','cod_ditta','ragione_sociale',
					    'giorno_1','giorno_2','giorno_3','giorno_4','giorno_5','giorno_6','giorno_7','giorno_8','giorno_9','giorno_10',
						'giorno_11','giorno_12','giorno_13','giorno_14','giorno_15','giorno_16','giorno_17','giorno_18','giorno_19','giorno_20',
						'giorno_21','giorno_22','giorno_23','giorno_24','giorno_25','giorno_26','giorno_27','giorno_28','giorno_29','giorno_30',
						'giorno_31','periodo','totale_periodo','commessa','codice_commessa','desc_commessa'];
		
		result = globals.xls_export(ds,fileName,localFile,false,false,null,'Commesse',template,colNames);
		ds.removeRow(-1);
		
		output = (result.length > 0 && result) || output;
		
		if(!output)
			return false;
		
		plugins.file.writeFile(fileName,output);
		
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		return false;
	}
	finally
	{
		return true;
	}
}

/**
 * Imposta i parametri per la generazione del report e lancia l'operazione asincrona
 * 
 * @properties={typeid:24,uuid:"A1C06188-0010-4458-9F3A-0A63C4F81F75"}
 */
function stampaReportStatoAvanzamentoLavori(event)
{
	try
	{
			var parameters;
			var reportName = 'COMM_StatoAvanzamento.jasper';
			var allaData = globals.TODAY;
			parameters = { ptoday :	allaData};
			
			var bytes = plugins.jasperPluginRMI.runReport(globals.getSwitchedServer(globals.Server.MA_PRESENZE)
							                              ,reportName
														  ,false
														  ,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF
														  ,parameters);
			
			plugins.file.writeFile('StatoAvanzamentoLavori_Al_'+ utils.dateFormat(allaData,globals.ISO_DATEFORMAT) +'.pdf',bytes);
			
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
	}
	finally
	{
		// Close this form					
//		globals.svy_mod_closeForm(event);
        return true;
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrClienti]
 *
 * @properties={typeid:24,uuid:"272287E2-ED22-4B04-ADBF-7D0713F7ADE1"}
 */
function exportReportRiepilogoDalAl(dal,al,arrClienti)
{
	try
	{
			var parameters;
			var reportName = 'COMM_RiepilogoCommesse_NoDettaglio.jasper';
			var allaData = globals.TODAY;
			parameters = { ptoday :	allaData,
				           pdal : dal,
						   pal : al,
						   parrclienti : arrClienti};
			
			var bytes = plugins.jasperPluginRMI.runReport(globals.getSwitchedServer(globals.Server.MA_PRESENZE)
							                              ,reportName
														  ,false
														  ,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF
														  ,parameters);
			
			plugins.file.writeFile('RiepilogoCommesse_Dal_' + globals.dateFormat(dal,globals.ISO_DATEFORMAT) +
				                   'Al_'+ utils.dateFormat(al,globals.ISO_DATEFORMAT) +'.pdf',bytes);
			
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
	}
	finally
	{
		return true;
	}
	
	// ottenimento del dataset
//	var ds = ottieniDatasetRiepilogoOreDalAl(dal,al,arrClienti);
//	
//	// definizione dei types associati alle colonne del dataset
//	var types = [JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.DATETIME,JSColumn.DATETIME,
//	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER];
//		
//	// creazione foundset corrispondente
//	var fs = databaseManager.getFoundSet(ds.createDataSource('dS_RiepilogoCommesse',types));
//    fs.loadAllRecords();
//    
//    var reportParams = new Object();
//	reportParams.ptoday = globals.TODAY;
//	reportParams.pdal = dal;
//	reportParams.pal = al;
//	
//	var bytes = plugins.jasperPluginRMI.runReport(fs,'COMM_RiepilogoCommesse.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams);
//
//	plugins.file.writeFile('Riepilogo_Commesse_Dal_'  + globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '_Al_' 
//		                   + globals.dateFormat(al,globals.ISO_DATEFORMAT) + '.pdf',bytes);
	
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrClienti]
 *
 * @properties={typeid:24,uuid:"2896AB7C-ABDA-4B97-B221-24C0B515AA16"}
 */
function exportReportRiepilogoDalAlFatturazione(dal,al,arrClienti)
{
	try
	{
			var parameters;
			var reportName = 'COMM_RiepilogoCommesse_NoDettaglio_Fatt.jasper';
			var allaData = globals.TODAY;
			parameters = { ptoday :	allaData,
				           pdal : dal,
						   pal : al,
						   parrclienti : arrClienti};
			
			var bytes = plugins.jasperPluginRMI.runReport(globals.getSwitchedServer(globals.Server.MA_PRESENZE)
							                              ,reportName
														  ,false
														  ,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF
														  ,parameters);
			
			plugins.file.writeFile('RiepilogoCommesseFatturazione_Dal_' + globals.dateFormat(dal,globals.ISO_DATEFORMAT) +
				                   'Al_'+ utils.dateFormat(al,globals.ISO_DATEFORMAT) +'.pdf',bytes);
			
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
	}
	finally
	{
		return true;
	}
//	// ottenimento del dataset
//	var ds = ottieniDatasetRiepilogoOreDalAlFatturazione(dal,al,arrClienti);
//	
//	// definizione dei types associati alle colonne del dataset
//	var types = [JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER];
//		
//	// creazione foundset corrispondente
//	var fs = databaseManager.getFoundSet(ds.createDataSource('dS_RiepilogoCommesseFatt',types));
//    fs.loadAllRecords();
//    
//    var reportParams = new Object();
//	reportParams.ptoday = globals.TODAY;
//	reportParams.pdal = dal;
//	reportParams.pal = al;
//	
//	var bytes = plugins.jasperPluginRMI.runReport(fs,'COMM_RiepilogoCommesse_Fatturazione.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams);
//
//	plugins.file.writeFile('Riepilogo_Commesse_Fatturazione_Dal_'  + globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '_Al_' 
//		                   + globals.dateFormat(al,globals.ISO_DATEFORMAT) + '.pdf',bytes);
	
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrClienti]
 *
 * @properties={typeid:24,uuid:"A843C2B1-F405-4DF9-9D99-2EAC0C4BB7C0"}
 */
function exportReportRiepilogoFasiDalAl(dal,al,arrClienti)
{
	try
	{
			var parameters;
			var reportName = 'COMM_RiepilogoCommesse.jasper';
			var allaData = globals.TODAY;
			parameters = { ptoday :	allaData,
				           pdal : dal,
						   pal : al,
						   parrclienti : arrClienti};
			
			var bytes = plugins.jasperPluginRMI.runReport(globals.getSwitchedServer(globals.Server.MA_PRESENZE)
							                              ,reportName
														  ,false
														  ,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF
														  ,parameters);
			
			plugins.file.writeFile('RiepilogoCommesse_Dal_' + globals.dateFormat(dal,globals.ISO_DATEFORMAT) +
				                   'Al_'+ utils.dateFormat(al,globals.ISO_DATEFORMAT) +'.pdf',bytes);
			
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
	}
	finally
	{
		return true;
	}
//	// ottenimento del dataset
//	var ds = ottieniDatasetRiepilogoOreFaseDalAl(dal,al,arrClienti);
//	
//	// definizione dei types associati alle colonne del dataset
//	var types = [JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.NUMBER,
//				 JSColumn.TEXT,JSColumn.TEXT,JSColumn.DATETIME,JSColumn.DATETIME,JSColumn.NUMBER,
//	             JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER,JSColumn.NUMBER];
//		
//	// creazione foundset corrispondente
//	var fs = databaseManager.getFoundSet(ds.createDataSource('dS_RiepilogoCommesseFasi',types));
//    fs.loadAllRecords();
//    
//    var reportParams = new Object();
//	reportParams.ptoday = globals.TODAY;
//	reportParams.pdal = dal;
//	reportParams.pal = al;
//	
//	var bytes = plugins.jasperPluginRMI.runReport(fs,'COMM_RiepilogoCommesseFasi.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams);
//
//	plugins.file.writeFile('Riepilogo_Commesse_Dal_'  + globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '_Al_' 
//		                   + globals.dateFormat(al,globals.ISO_DATEFORMAT) + '.pdf',bytes);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrClienti]
 *
 * @properties={typeid:24,uuid:"2460F533-0C5B-40C1-B228-959E055C33A6"}
 */
function exportReportRiepilogoFasiDalAlFatturazione(dal,al,arrClienti)
{
	try
	{
			var parameters;
			var reportName = 'COMM_RiepilogoCommesse_NoDettaglio_Fatt.jasper';
			var allaData = globals.TODAY;
			parameters = { ptoday :	allaData,
				           pdal : dal,
						   pal : al,
						   parrclienti : arrClienti};
			
			var bytes = plugins.jasperPluginRMI.runReport(globals.getSwitchedServer(globals.Server.MA_PRESENZE)
							                              ,reportName
														  ,false
														  ,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF
														  ,parameters);
			
			plugins.file.writeFile('RiepilogoCommesse_Dal_' + globals.dateFormat(dal,globals.ISO_DATEFORMAT) +
				                   'Al_'+ utils.dateFormat(al,globals.ISO_DATEFORMAT) +'.pdf',bytes);
			
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
	}
	finally
	{
		return true;
	}
	// ottenimento del dataset
//	var ds = ottieniDatasetRiepilogoOreFaseDalAlFatturazione(dal,al,arrClienti);
//	
//	// definizione dei types associati alle colonne del dataset
//	var types = [JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.TEXT,JSColumn.NUMBER];
//		
//	// creazione foundset corrispondente
//	var fs = databaseManager.getFoundSet(ds.createDataSource('dS_RiepilogoCommesseFasiFatt',types));
//    fs.loadAllRecords();
//    
//    var reportParams = new Object();
//	reportParams.ptoday = globals.TODAY;
//	reportParams.pdal = dal;
//	reportParams.pal = al;
//	
//	var bytes = plugins.jasperPluginRMI.runReport(fs,'COMM_RiepilogoCommesseFasi_Fatturazione.jasper',null,plugins.jasperPluginRMI.OUTPUT_FORMAT.PDF,reportParams);
//
//	plugins.file.writeFile('Riepilogo_Commesse_Fasi_Fatturazione_Dal_'  + globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '_Al_' 
//		                   + globals.dateFormat(al,globals.ISO_DATEFORMAT) + '.pdf',bytes);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrClienti]
 *
 * @properties={typeid:24,uuid:"350D2685-C59E-4293-AE2A-3267AEBFC7A0"}
 */
function createExcelRiepilogoDalAl(dal,al,arrClienti)
{
	try
	{
		var fileName = ['Riepilogo_Commesse', '_Dal', globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '_Al' , globals.dateFormat(al,globals.ISO_DATEFORMAT)].join('_') + '.xls';
		var localFile = true;
		/** @type {Array<byte>} */
		var output = [];
		var result = [];
		
		var template = plugins.file.readFile('C:/Report/COMM_RiepilogoCommesse.xls');
		
		var ds = ottieniDatasetRiepilogoOreDalAl(dal,al,arrClienti);
		
		var colNames = ['codicecliente','cliente','codicecommessa','descrizionecommessa','iniziovalidita',
		                'finevalidita','monteorecommessa','orepianificate','autorizzate','dafatturare'];
		
		result = globals.xls_export(ds,fileName,localFile,false,false,null,'Commesse',template,colNames);
		ds.removeRow(-1);
		
		output = (result.length > 0 && result) || output;
		
		if(!output)
			return false;
		
		plugins.file.writeFile(fileName,output);
		
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		return false;
	}
	finally
	{
		return true;
	}
	
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrClienti]
 *
 * @properties={typeid:24,uuid:"097F47EF-DC55-4F1F-8FE4-A90A29391A85"}
 */
function createExcelRiepilogoDalAlFatturazione(dal,al,arrClienti)
{
	try
	{
		var fileName = ['Riepilogo_Commesse_Fatturazione', '_Dal', globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '_Al' , globals.dateFormat(al,globals.ISO_DATEFORMAT)].join('_') + '.xls';
		var localFile = true;
		/** @type {Array<byte>} */
		var output = [];
		var result = [];
		
		var template = plugins.file.readFile('C:/Report/COMM_RiepilogoCommesse_Fatturazione.xls');
		
		var ds = ottieniDatasetRiepilogoOreDalAlFatturazione(dal,al,arrClienti);
		
		var colNames = ['codicecliente','cliente','codicecommessa','descrizionecommessa','dafatturare'];
		
		result = globals.xls_export(ds,fileName,localFile,false,false,null,'Commesse',template,colNames);
		ds.removeRow(-1);
		
		output = (result.length > 0 && result) || output;
		
		if(!output)
			return false;
		
		plugins.file.writeFile(fileName,output);
		
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		return false;
	}
	finally
	{
		return true;
	}
	
}


/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrClienti]
 * 
 * @properties={typeid:24,uuid:"8D5386B2-02BB-4C71-B6EC-B5AA0BD25213"}
 */
function createExcelRiepilogoFasiDalAl(dal,al,arrClienti)
{
	try
	{
		var fileName = ['Riepilogo_Commesse_Fasi', '_Dal', globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '_Al' , globals.dateFormat(al,globals.ISO_DATEFORMAT)].join('_') + '.xls';
		var localFile = true;
		/** @type {Array<byte>} */
		var output = [];
		var result = [];
		
		var template = plugins.file.readFile('C:/Report/COMM_RiepilogoCommesseFasi.xls');
		
		var ds = ottieniDatasetRiepilogoOreFaseDalAl(dal,al,arrClienti);
		
		var colNames = ['codicecliente','cliente','codicecommessa','descrizionecommessa','iniziovaliditacommessa',
		                'finevaliditacommessa','monteorecommessa',
		                'codicefase','descrizionefase','iniziovaliditafase','finevaliditafase','monteorefase',
						'pianificate','autorizzate','dafatturare'];
		
		result = globals.xls_export(ds,fileName,localFile,false,false,null,'Commesse',template,colNames);
		ds.removeRow(-1);
		
		output = (result.length > 0 && result) || output;
		
		if(!output)
			return false;
		
		plugins.file.writeFile(fileName,output);
		
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		return false;
	}
	finally
	{
		return true;
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} [arrClienti]
 * 
 * @properties={typeid:24,uuid:"37069992-61FC-4595-A796-F177A03C080B"}
 */
function createExcelRiepilogoFasiDalAlFatturazione(dal,al,arrClienti)
{
	try
	{
		var fileName = ['Riepilogo_Commesse_Fasi_Fatturazione', '_Dal', globals.dateFormat(dal,globals.ISO_DATEFORMAT) + '_Al' , globals.dateFormat(al,globals.ISO_DATEFORMAT)].join('_') + '.xls';
		var localFile = true;
		/** @type {Array<byte>} */
		var output = [];
		var result = [];
		
		var template = plugins.file.readFile('C:/Report/COMM_RiepilogoCommesseFasi_Fatturazione.xls');
		
		var ds = ottieniDatasetRiepilogoOreFaseDalAlFatturazione(dal,al,arrClienti);
		
		var colNames = ['codicecliente','cliente','codicecommessa','descrizionecommessa',
		                'codicefase','descrizionefase','dafatturare'];
		
		result = globals.xls_export(ds,fileName,localFile,false,false,null,'Commesse',template,colNames);
		ds.removeRow(-1);
		
		output = (result.length > 0 && result) || output;
		
		if(!output)
			return false;
		
		plugins.file.writeFile(fileName,output);
		
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		return false;
	}
	finally
	{
		return true;
	}
}