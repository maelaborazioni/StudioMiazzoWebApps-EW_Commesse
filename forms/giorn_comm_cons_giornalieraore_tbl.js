/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DD5A26E7-0D06-4B0F-A7B9-A5931137AA44"}
 */
function onRightClickAuth(event) 
{
	var source = event.getSource();
	var popUpMenu = plugins.window.createPopupMenu();
	
	var item_1 = popUpMenu.addMenuItem('Autorizza tutte le ore',oreCommessaAutorizzaTutte);
	item_1.methodArguments = [event,1];
	var item_2 = popUpMenu.addMenuItem('Togli l\'autorizzazione a tutte le ore',oreCommessaAutorizzaTutte);
	item_2.methodArguments = [event,0];
	
	if(source != null)
	   popUpMenu.show(source);
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2773A303-16E6-4A6B-A7F5-883A4012B020"}
 */
function onRightClickFatt(event) 
{
	var source = event.getSource();
	var popUpMenu = plugins.window.createPopupMenu();
	
	var item_1 = popUpMenu.addMenuItem('Rendi fatturabili tutte le ore',oreCommessaFatturaTutte);
	item_1.methodArguments = [event,1];
	var item_2 = popUpMenu.addMenuItem('Togli la fatturabilità a tutte le ore',oreCommessaFatturaTutte);
	item_2.methodArguments = [event,0];
	
	if(source != null)
	   popUpMenu.show(source);
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _autorizzato
*
* @properties={typeid:24,uuid:"582CAEA9-EA44-4E76-B188-8D2DA5D74904"}
*/
function oreCommessaAutorizzaTutte(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,_autorizzato)
{
	databaseManager.startTransaction();
	
	for (var s = 1; s <= foundset.getSize(); s++)
	{
		var rec = foundset.getRecord(s);
		if(rec.commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.daautorizzare)
		   rec.autorizzato = _autorizzato;
	}
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _fatturabile
*
* @properties={typeid:24,uuid:"5FFCD239-4270-44C9-B994-1E56D4030EFF"}
*/
function oreCommessaFatturaTutte(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,_fatturabile)
{
    databaseManager.startTransaction();
	
	for (var s = 1; s <= foundset.getSize(); s++)
	{
		var rec = foundset.getRecord(s);
		if(rec.commesse_giornaliera_ore_to_commesse_giornaliera.commesse_giornaliera_to_ditte_commesse_fasi.dafatturare)
		   rec.billable = _fatturabile;
	}
}

/**
* @param {Number} _itemInd
* @param {Number} _parItem
* @param {Boolean} _isSel
* @param {String} _parMenTxt
* @param {String} _menuTxt
* @param {JSEvent} _event
* @param {Number} _consolida
*
* @properties={typeid:24,uuid:"866A2CAF-99F1-4FA7-A47D-7A75D2F1DAAF"}
*/
function oreCommessaConsolidaTutte(_itemInd,_parItem,_isSel,_parMenTxt,_menuTxt,_event,_consolida)
{
    databaseManager.startTransaction();
	
	for (var s = 1; s <= foundset.getSize(); s++)
	{
		var rec = foundset.getRecord(s);
		rec.consolidato = _consolida;
	}
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D712EEB8-F60B-4A51-950C-A4CB6E41A33E"}
 */
function onRenderAutorizzazione(event) 
{
	var rec = event.getRecord();
	var ren = event.getRenderable();
	ren.border = 'Empty';
	if(rec && globals.isDaAutorizzareInPresenze(globals.getDittaCommessaFaseDaCommessaGiornaliera(rec['idcommessagiornaliera'])))
	   ren.enabled = true;
    else
	   ren.enabled = false;
}

/**
 *  * @param {JSRenderEvent} event
 *
 * @properties={typeid:24,uuid:"DFD2AED3-8784-4A62-870F-54B3FB3D1961"}
 */
function onRenderFatturazione(event)
{
	var rec = event.getRecord();
	var ren = event.getRenderable();
	ren.border = 'Empty';
	if(rec && globals.isDaAutorizzarePerFatturazione(globals.getDittaCommessaFaseDaCommessaGiornaliera(rec['idcommessagiornaliera'])))
	 	  ren.enabled = true;
	   else
		  ren.enabled = false;
		
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"94F51414-A96D-4DC8-9670-7E224E01299B"}
 */
function onRightClickCons(event) 
{
	var source = event.getSource();
	var popUpMenu = plugins.window.createPopupMenu();
	
	var item_1 = popUpMenu.addMenuItem('Consolida tutte le ore',oreCommessaConsolidaTutte);
	item_1.methodArguments = [event,1];
	var item_2 = popUpMenu.addMenuItem('Togli il consolidamento a tutte le ore',oreCommessaConsolidaTutte);
	item_2.methodArguments = [event,0];
	
	if(source != null)
	   popUpMenu.show(source); 
}
