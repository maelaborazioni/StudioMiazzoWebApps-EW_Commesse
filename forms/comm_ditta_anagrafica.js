
/**
 *
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"BC1D91E0-F822-4A7D-BDA0-9C88B94D335A"}
 */
function onShowForm(_firstShow, _event) {
	_super.onShowForm(_firstShow, _event);
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CF92E7CD-2059-4F08-ACFF-C46592EE40D0"}
 */
function onActionBtnAddIndirizzo(event) 
{
	var frm = forms.comm_ditta_anagrafica_indirizzi_dtl;
	var fs = frm.foundset;
	
	databaseManager.startTransaction();
	var rec = fs.getRecord(fs.newRecord());
	if(!rec)
	{
		globals.ma_utl_showWarningDialog('Errore durante la creazione del nuovo indirizzo','Nuovo indirizzo cliente');
		databaseManager.rollbackTransaction();
		return;
	}
	
	rec.idditta = foundset.idditta;
	rec.datarilevazione = new Date();
	rec.codstatoestero = 1;
	rec.codtipoindirizzo = globals.TipiIndirizzoDitta.UNITA_OPERATIVA;
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Nuovo indirizzo cliente');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"038CF048-F546-4A2D-A67A-0C9F2807DE78"}
 */
function onActionBtnEditIndirizzo(event) 
{
	var frm = forms.comm_ditta_anagrafica_indirizzi_dtl;
	var fs = frm.foundset;
	
	if(foundset.ditte_to_ditte_indirizzi)
	{
		fs.loadRecords(foundset.ditte_to_ditte_indirizzi.iddittaindirizzo);
	    databaseManager.startTransaction();
	    globals.ma_utl_showFormInDialog(frm.controller.getName(),'Modifica indirizzo cliente');
	}
	else
		globals.ma_utl_showWarningDialog('Nessun indirizzo presente da poter modificare','Modifica indirizzo cliente');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"79D8B385-561B-4AA3-A190-6EC6DBB5659B"}
 */
function onActionBtnDelIndirizzo(event) 
{
	if(foundset.ditte_to_ditte_indirizzi)
	{
		if(!foundset.ditte_to_ditte_indirizzi.deleteRecord())
			globals.ma_utl_showWarningDialog('Eliminazione indirizzo non riuscita, si prega di riprovare','Elimina indirizzo cliente');
	}
	else
		globals.ma_utl_showWarningDialog('Nessun indirizzo presente da poter eliminare','Elimina indirizzo cliente');
		
}
