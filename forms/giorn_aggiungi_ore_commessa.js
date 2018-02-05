/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"6F43AD6F-AE59-49F8-A2AF-A10085145E47",variableType:8}
 */
var _idLav = null;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"0A119106-F05B-4BC0-A451-0EE059DE8F4F",variableType:93}
 */
var _giorno = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"7494DE14-EBB1-469A-9D3C-6C1D9088DA84",variableType:8}
 */
var _idDittaCommessa = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"3503B6BD-A92B-40F9-B8F1-15C717843982",variableType:8}
 */
var _ore = null;
/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"FDAC6874-2EDD-4735-9ADD-F215BA745444"}
 */
var _proprieta = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1AA251A7-2555-47DC-A122-FE53F7543669"}
 */
function annullaInserimentoOreCommessa(event) 
{
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
 * @properties={typeid:24,uuid:"8570C930-E44A-48E2-8A90-56181D93184C"}
 */
function confermaInserimentoOreCommessa(event) 
{
	// TODO Inserimento in commesse_giornaliera,commesse_giornalieraore
	if(_idDittaCommessa == null)
	{
		globals.ma_utl_showWarningDialog('Selezionare una commessa','Inserimento ore commesse');
		return;
	}
	
	if(_ore == null)
	{
		globals.ma_utl_showWarningDialog('Inserire un valore per il numero delle ore','Inserimento ore comemsse');
		return;
	}
	
	if(!globals.inserisciOreCommessa(_idLav
		                             ,utils.dateFormat(_giorno,globals.ISO_DATEFORMAT)
									 ,_idDittaCommessa
									 ,_ore
									 ,_proprieta))
	   globals.ma_utl_showErrorDialog('Errore in inserimento ore commessa','Inserimento ore commessa');
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}
