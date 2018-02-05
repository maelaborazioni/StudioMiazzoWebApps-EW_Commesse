
/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} svyNavBaseOnShow
 *
 * @properties={typeid:24,uuid:"9B07F8AF-4BBD-4830-8421-34FB3B8B7C68"}
 */
function onShowForm(firstShow, event, svyNavBaseOnShow)
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	
	plugins.busy.prepare();
	
	elements.btn_conferma_inserimento.enabled = true;
    forms.comm_ore_inserimento_tab.setStatusNeutral();
	setStatus('Pronto per l\'inserimento dati');
}

/**
*
* @param {JSEvent} event
*
* @properties={typeid:24,uuid:"BB95D21C-847D-4E20-B3BF-97DF1ACD2CF9"}
*/
function onHide(event) 
{
	annullaInserimento(event);
}
