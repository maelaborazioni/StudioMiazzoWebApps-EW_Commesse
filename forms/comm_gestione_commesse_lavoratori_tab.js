
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C831FBA6-6763-495E-8A5C-0E0F49D9FA88"}
 */
function onActionAnnulla(event) 
{
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AD386067-6630-42B8-AA3F-6D65AAF57823"}
 */
function onActionConferma(event) 
{
	try
	{
		var frm = forms['comm_gestione_commesse_lavoratori_tbl_temp'];
		var fs = frm.foundset;
		
		// inserisci i lavoratori selezionati per la commessa nella tabella lavoratori_commesse
		databaseManager.startTransaction();
		
		/** @type{JSFoundset<db:/ma_anagrafiche/lavoratori_commesse>} */
		var fsLavComm = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI_COMMESSE);
		for (var lc = 0; lc < fs.getSize(); lc++)
		{
			var recLavComm = fsLavComm.getRecord(fsLavComm.newRecord());
			if(!recLavComm)
				throw new Error("Errore durante la creazione del nuovo record lavoratore-commessa");
			
			recLavComm.idlavoratore = fs.getRecord(lc)['idlavoratore'];
			recLavComm.iddittacommessa = forms.comm_gestione_commesse_tbl.iddittacommessa;

		}
		
		var success = databaseManager.commitTransaction();
		if (!success) 
		{
			var failedrecords = databaseManager.getFailedRecords();
			if (failedrecords && failedrecords.length > 0)
				throw new Error('Errore durante il salvataggio del record lavoratore-commessa');

		}
		
	}
	catch(ex)
	{
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message);
	}
	finally
	{
		databaseManager.setAutoSave(false);
	}
	globals.svy_mod_closeForm(event);
}
