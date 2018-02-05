/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B42C82CE-82BA-4965-AD84-D815DAE54DDD"}
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
 * @properties={typeid:24,uuid:"F9EBCB90-5C6B-4F44-8CD1-B8A1EE10A72A"}
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
* @properties={typeid:24,uuid:"B32D2ECA-F411-48D0-86AC-71EF72EB8884"}
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
* @properties={typeid:24,uuid:"FA64E9A9-BCE7-4053-88D2-43B4C32E03EB"}
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
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"12B48109-8787-46BA-B519-DCF0ED9DD349"}
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
 * @properties={typeid:24,uuid:"178D0547-6218-4971-8416-7C81B77BDFF2"}
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
