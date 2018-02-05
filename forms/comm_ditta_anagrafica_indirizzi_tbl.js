
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1B1F1C86-9398-4FA8-B7AB-3021E6AF3B8A"}
 * @AllowToRunInFind
 */
function onActionBtnRecapiti(event)
{
	var frm = forms.comm_ditta_recapiti_main;
	var fs= frm.foundset;
	
	fs.find();
	fs.iddittaindirizzo = foundset.iddittaindirizzo;
	fs.search();
	
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Recapiti indirizzo');
}
