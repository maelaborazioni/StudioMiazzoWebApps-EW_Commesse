/**
 * Prepara la struttura riepilogativa delle ore su commesse 
 * per la visualizzazione del lavoratore nel periodo richiesto
 * 
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 * @param {Array<Number>} arrRigheComm
 *
 * @properties={typeid:24,uuid:"F8135FD7-E0CA-431A-9DC0-396514CA4D9E"}
 */
function preparaCommesseLavoratore(idLavoratore,dal,al,arrRigheComm)
{
	if(arrRigheComm.length == 0)
	{
		forms['comm_visualizza_copertura_dipendente_' + idLavoratore].elements.tab_visualizza_copertura_dip.transparent = true;
	    return;
	}
	else
		forms['comm_visualizza_copertura_dipendente_' + idLavoratore].elements.tab_visualizza_copertura_dip.transparent = false;
    
	// Numero giorni totali visualizzati in giornaliera	
	var numGiorni = Math.floor((al - dal)/86400000) + 1;
    
	// Array per gestione dati
	var types = [JSColumn.NUMBER,JSColumn.TEXT,JSColumn.TEXT];
	var cols = ['iddittacommessa','codice','descrizione'];
	
	// Costruzione struttura tipi e colonne della matrice
	for(var col = 0; col < numGiorni; col++)
	{
		types.push(JSColumn.NUMBER);
		cols.push('giorno_' + globals.dateFormat(new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + col),globals.ISO_DATEFORMAT));
	}
	
	// Tipo e colonna aggiuntiva per riepilogo
	types.push(JSColumn.NUMBER);
	cols.push('totale');
	
	// Creazione matrice commesse
    var dsCurrMese = databaseManager.createEmptyDataSet(arrRigheComm.length,cols);
	    
    // Compilazione iniziale matrice commesse
    for(var rg = 0; rg < arrRigheComm.length; rg++)
    {
    	dsCurrMese.setValue(rg + 1,1,arrRigheComm[rg]);
    	dsCurrMese.setValue(rg + 1,2,globals.getCodiceCommessaDitta(arrRigheComm[rg]));
    	dsCurrMese.setValue(rg + 1,3,globals.getDescrizioneCommessaDitta(arrRigheComm[rg]));
    	
    	for(col = 1; col <= (numGiorni + 1); col++)
    		dsCurrMese.setValue(rg + 1,4 + col,null);
    		
    }	
    
    var colTot = dsCurrMese.getMaxColumnIndex();
        
    for(var row = 1; row <= arrRigheComm.length; row++)
	{
		for(var cg = 1; cg <= dsCurrMese.getMaxColumnIndex(); cg++)
		{		
			var giorno = new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + (cg - 1));
			var oreCg = globals.getOreGiornoDipendenteCommessa(arrRigheComm[row],idLavoratore,giorno);
			if(oreCg)
			{
				dsCurrMese.setValue(row,3 + cg,oreCg);
			    dsCurrMese.setValue(row,colTot,dsCurrMese.getValue(row,colTot) + dsCurrMese.getValue(row,3 + cg))
			}
		}
	}
		
	/** @type {String}*/
	var dSComm = dsCurrMese.createDataSource('dSComm_' + idLavoratore + '_Dal' + utils.dateFormat(dal,globals.ISO_DATEFORMAT) +
		                                     '_Al' + utils.dateFormat(al,globals.ISO_DATEFORMAT) + '_' + arrRigheComm.length,types);
		
	disegnaCommesseLavoratore(idLavoratore,dal,al,dSComm);
}

/**
 * Gestisce il disegno riepilogativo delle commesse per il lavoratore nel periodo richiesto
 * 
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 * @param {String} datasource
 *
 * @properties={typeid:24,uuid:"8C92820E-60A0-4F43-894B-C574054946B4"}
 */
function disegnaCommesseLavoratore(idLavoratore,dal,al,datasource)
{
	var numGiorni = Math.floor((al - dal)/86400000) + 1;
	
	// creazione della form dinamica base da clonare per il disegno degli eventi
    var newFormCommName = 'comm_list_visualizza_copertura_' + idLavoratore;
    if(solutionModel.getForm(newFormCommName))
    {
    	history.removeForm(newFormCommName);
    	solutionModel.removeForm(newFormCommName);
    }
    
	var newFormComm = solutionModel.newForm(newFormCommName,datasource,'leaf_style',false,640,100);
    newFormComm.view = JSForm.LOCKED_TABLE_VIEW;
    newFormComm.dataSource = datasource;
    
    var dxDesc = 200;
    var dxCod = 100;
    var dxEv = 45;
    var dy = 20;
    
    var newCod = newFormComm.newField('codice',JSColumn.TEXT,0,dy,dxCod,dy);
	    newCod.name = 'fld_cod';
	    newCod.displayType = JSField.TEXT_FIELD;
	    newCod.styleClass = 'table';
	    newCod.horizontalAlignment = SM_ALIGNMENT.CENTER;
    var newLblCod = newFormComm.newLabel('lbl_evento',0,0,dxCod,dy);
        newLblCod.labelFor = newCod.name;
        newLblCod.styleClass = 'table_header';
        newLblCod.text = 'Codice';     
	    newLblCod.horizontalAlignment = SM_ALIGNMENT.CENTER;
        
    var newDesc = newFormComm.newField('descrizione',JSColumn.TEXT,dxCod,dy,dxDesc,dy);
        newDesc.name = 'fld_desc';
        newDesc.displayType = JSField.TEXT_FIELD;
        newDesc.styleClass = 'table';
    var newLblDesc = newFormComm.newLabel('lbl_descrizione',dxCod,0,dxDesc,dy);
        newLblDesc.labelFor = newDesc.name;
        newLblDesc.styleClass = 'table_header';
        newLblDesc.text = 'Descrizione';
        newLblDesc.horizontalAlignment = SM_ALIGNMENT.CENTER;
        
    for(var g = 1; g <= numGiorni; g++)
    {
    	var gDay = new Date(dal.getFullYear(),dal.getMonth(),dal.getDate() + (g - 1));
    	var gFormat = globals.dateFormat(gDay,globals.ISO_DATEFORMAT);
    	
    	var newFld = newFormComm.newField('giorno_' + gFormat,JSColumn.NUMBER,dxCod + dxDesc + dxEv * (g - 1),0,dxEv,20);
    	    newFld.name = 'fld_giorno_' + gFormat;
    	    newFld.displayType = JSField.TEXT_FIELD;
    	    newFld.styleClass = 'table';
    	    newFld.horizontalAlignment = SM_ALIGNMENT.CENTER;
    	var newLbl = newFormComm.newLabel('lbl_giorno_' + gFormat,dxCod + dxDesc + dxEv * (g - 1),0,dxEv,20);
	    	newLbl.labelFor = newFld.name;
	    	newLbl.styleClass = 'table_header';
	    	newLbl.text = globals.getNomeGiorno(gDay) + ' ' + globals.getNumGiorno(gDay);
	    	newLbl.horizontalAlignment = SM_ALIGNMENT.CENTER;
    }
    
    var newTotale = newFormComm.newField('totale',JSColumn.TEXT,dxCod + dxDesc + dxEv * g,dy,dxEv + 5,dy);
	    newTotale.name = 'fld_totale';
	    newTotale.displayType = JSField.TEXT_FIELD;
	    newTotale.styleClass = 'table';
	    newTotale.horizontalAlignment = SM_ALIGNMENT.CENTER;
	    newTotale.fontType = 'Arial,1,11';
    var newLblTotale = newFormComm.newLabel('lbl_totale',0,0,dxEv + 5,dy);
	    newLblTotale.labelFor = newTotale.name;
	    newLblTotale.styleClass = 'table_header';
	    newLblTotale.text = 'Totale';     
	    newLblTotale.horizontalAlignment = SM_ALIGNMENT.CENTER;
    
	    forms['comm_visualizza_copertura_dipendente_' + idLavoratore].elements.tab_visualizza_copertura_dip.addTab(newFormCommName);
 	
}