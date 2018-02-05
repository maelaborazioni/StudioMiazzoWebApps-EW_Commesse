
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"290237EC-9D64-4B17-A277-7C0707034112"}
 */
function apriInserimentoTimbraturaSingola(event)
{
	var frm = forms.comm_timbr_commessa_dtl;
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Timbratura immediata per commessa');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"35F4A3A2-AEB2-46E8-B4D9-91F9783AB9BE"}
 * @AllowToRunInFind
 */
function apriInserimentoTimbraturaMultipla(event)
{
	var frm = forms.comm_timbr_commessa_tab;
	frm.vIdLavoratore = _to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore;
	frm.vGiorno = globals.TODAY;
	
	// aggiornamento commesse selezionabili
	var sqlCommesse = "SELECT idDittaCommessa, Codice + ' - ' + CAST(Descrizione AS varchar)\
	           FROM Ditte_Commesse WHERE idDitta = ?";
	var arrCommesse = [globals.getDitta(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore)];
	var dsCommesse = databaseManager.getDataSetByQuery(globals.Server.MA_ANAGRAFICHE,sqlCommesse,arrCommesse,-1);
	var realValues = new Array();
	var displayValues = new Array();
	if(dsCommesse && dsCommesse.getMaxRowIndex() > 0)
	{
		realValues[0] = -1;
		displayValues[0] = '';

		realValues = realValues.concat(dsCommesse.getColumnAsArray(1));
		displayValues = displayValues.concat(dsCommesse.getColumnAsArray(2));
		
		application.setValueListItems('vls',displayValues,realValues);
	}
	else
	{
		globals.ma_utl_showWarningDialog('Nessuna commessa selezionabile','Inserisci timbrature commessa');
		return;
	}
	
	globals.ma_utl_setStatus(globals.Status.EDIT,frm.controller.getName());
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Inserisci timbrature commessa');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4078B792-1690-4EAC-B87E-3F5883A923CF"}
 */
function apriInserimentoOre(event) {
	// TODO Auto-generated method stub
}

