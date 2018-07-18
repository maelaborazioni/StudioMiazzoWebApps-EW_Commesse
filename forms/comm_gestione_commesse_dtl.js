/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"299FAD85-E53F-42F7-A5B2-0B71060BEE38",variableType:8}
 */
var _idditta = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"3606E62A-432E-429D-A9F8-0E4731149758"}
 */
var _codditta = null;

/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"3621CD5F-C0B6-4EB1-9386-1B9BBBDC69C3"}
 */
var _ragionesociale = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"45AD9896-15E2-4913-90E8-0FA8257E5A66",variableType:4}
 */
var _esclusivoditta = 0;

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"12BD3368-93D9-4760-9D11-06738E9D44B0"}
 */
function onDataChangeEsclusivoDitta(oldValue, newValue, event) 
{
	if(!newValue)
	{
		_idditta = null;
		_codditta = _ragionesociale = '';
	}
		
	elements.fld_codice_ditta.enabled = 
		elements.fld_ragione_sociale.enabled = 
			elements.lbl_codice_ditta.enabled =
				elements.lbl_ragione_sociale.enabled 
				  elements.btn_lkp_ditta.enabled = newValue;
	return true;
}

/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1CAA80C6-028C-41B7-A209-972F8D9F2C80"}
 */
function onDataChangeEvGenerato(oldValue, newValue, event)
{
	// TODO Auto-generated method stub
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E433B6FD-BD3C-4E0C-8974-C26A64DDDFAA"}
 */
function onActionEvGenerato(event) {
	// TODO Auto-generated method stub
	globals.ma_utl_showWarningDialog('Under construction...','Evento generato dalla commessa');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"95AA04A5-E037-4E85-A492-455033EFEBE5"}
 */
function confermaInserimentoCommessa(event) 
{
	foundset.iddittaesclusiva = _idditta;
	
	if(iniziovalidita && finevalidita && iniziovalidita > finevalidita)
	{
		globals.ma_utl_showWarningDialog('La data di inizio della commessa non può essere maggiore della data di fine della commessa stessa','Inserimento anagrafica commessa')
	    return;
	}
	
	var params = {
        processFunction: process_inserimento_commessa,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [event]
    };
	plugins.busy.block(params);
}
	
/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"12C39151-3410-43E6-AF48-6EA057D4FD62"}
 */
function process_inserimento_commessa(event)
{
	try
	{
		if(!databaseManager.commitTransaction())
		{
			databaseManager.rollbackTransaction();
			globals.ma_utl_showWarningDialog('Inserimento non riuscito, si prega di riprovare.','Inserimento anagrafica commessa');
		}
		else
			databaseManager.refreshRecordFromDatabase(foundset,-1);
			
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_inserimento_commessa : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4A889608-A332-48FA-ABD5-8FAFB0C20059"}
 */
function annullaInserimentoCommessa(event) 
{
	// TODO Auto-generated method stub
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * @param {JSRecord} _rec
 *
 * @properties={typeid:24,uuid:"0CEEC52B-0A73-4CBB-A29B-43FC5DD30727"}
 */
function AggiornaDittaEsclusiva(_rec)
{
	if(_idditta != -1)
	   onDataChangeDitta(-1,_idditta,new JSEvent);
	
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"5910056D-D2F3-4C77-B55C-F60007B9795C"}
 * @AllowToRunInFind
 */
function onDataChangeDitta(oldValue, newValue, event)
{
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte>} */
	var _foundset = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE);
	if(_foundset.find())
	{
		_foundset.idditta = newValue;
		if(_foundset.search())
		{
			_codditta = _foundset.codice; 
			_idditta = _foundset.idditta;
			_ragionesociale = _foundset.ragionesociale;
		
			return true;
		}
	}
	
	globals.svy_nav_showLookupWindow(event, '_idditta', 'LEAF_Lkp_Ditte', 'AggiornaDittaEsclusiva', 'FiltraDittaStandard', null, null, '', true);
	
	return true;
}

/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} svyNavBaseOnShow
 *
 * @properties={typeid:24,uuid:"64A108DF-28D3-4020-A025-7BFA5AEC9118"}
 */
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	plugins.busy.prepare();
}
