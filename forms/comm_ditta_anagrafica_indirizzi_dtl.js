
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1A5C2881-E00B-4210-B3B2-887D32B4134E"}
 */
function onActionBtnConfermaIndirizzo(event) 
{
	if(!databaseManager.commitTransaction())
	{
		globals.ma_utl_showWarningDialog('Errore durante il salvataggio dell\'indirizzo, si prega di riprovare','Salva indirizzo cliente');
		databaseManager.rollbackTransaction();
	}
	
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
 * @properties={typeid:24,uuid:"23904818-AFF9-475B-919F-B4C3AB6EF5C4"}
 */
function onActionAnnullaIndirizzo(event) 
{
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
*
* @param {Boolean} firstShow
* @param {JSEvent} event
* @param {Boolean} svyNavBaseOnShow
*
* @properties={typeid:24,uuid:"3B37C6C4-7082-4172-981E-8194224BCC34"}
*/
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
//	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}
