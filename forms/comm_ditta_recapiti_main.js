/**
 * @properties={typeid:24,uuid:"55C397D6-E8CB-4BC8-9A98-9FBE69129BEE"}
 */
function onShowForm(firstShow,event)
{
	_super.onShowForm(firstShow,event,true);
	foundset.sort('codtiporecapito asc');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"43C90F94-35BA-4E7B-8FCE-523A9DA04114"}
 */
function onActionBtnConferma(event) 
{
	if(!databaseManager.commitTransaction())
	{
	   databaseManager.rollbackTransaction();
	   globals.ma_utl_showErrorDialog('Errore durante il salvataggio dei dati, si prega di riprovare','Recapiti indirizzo');
	}
	globals.ma_utl_setStatus(globals.Status.EDIT,forms.comm_ditta_recapiti_tbl.controller.getName());
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @private 
 * @properties={typeid:24,uuid:"0FA6E1A6-AED7-468C-A1AB-258F20E724DA"}
 */
function onActionBtnAnnulla(event) 
{
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.EDIT,forms.comm_ditta_recapiti_tbl.controller.getName());
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9306A6FE-D341-4BFE-9A5A-72C1F07F72B8"}
 */
function onActionBtnAddRecapito(event) 
{
	globals.ma_utl_setStatus(globals.Status.EDIT,forms.comm_ditta_recapiti_main.controller.getName());
	globals.ma_utl_setStatus(globals.Status.EDIT,forms.comm_ditta_recapiti_tbl.controller.getName());
	databaseManager.startTransaction();
	foundset.getSelectedRecord().ditte_indirizzi_to_ditte_recapiti.newRecord();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E7E9CEF4-3985-4DF8-865F-883E8C35FB1C"}
 */
function onActionBtnEditRecapito(event)
{
	if(foundset.ditte_indirizzi_to_ditte_recapiti.getSize() == 0)
	{
		globals.ma_utl_showWarningDialog('Nessun recapito da modificare','Modifica recapito');
		return;
	}
	globals.ma_utl_setStatus(globals.Status.EDIT,forms.comm_ditta_recapiti_main.controller.getName());
	globals.ma_utl_setStatus(globals.Status.EDIT,forms.comm_ditta_recapiti_tbl.controller.getName());
	databaseManager.startTransaction();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CF3F2F09-A07C-4AA3-B4CB-E8582F9A3E5A"}
 */
function onActionBtnDeleteRecapito(event) 
{
	if(foundset.ditte_indirizzi_to_ditte_recapiti.getSize() == 0)
	{
		globals.ma_utl_showWarningDialog('Nessun recapito da eliminare','Elimina recapito');
		return;
	}
	if(!foundset.ditte_indirizzi_to_ditte_recapiti.deleteRecord())
	   globals.ma_utl_showErrorDialog('Errore durante l\'eliminazione del recapito, si prega di riprovare','Elimina recapito');
}

/**
*
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"B42C119E-FE22-49E6-A548-60B27A19E973"}
*/
function onHide(event) 
{
	onActionBtnAnnulla(event);
}