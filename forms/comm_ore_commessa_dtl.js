/**
 * @type {Number}
 * @properties={typeid:35,uuid:"19420088-147B-4081-A649-8221FE252EC1",variableType:8}
 */
var vIdDittaCommessa = null;

/**
 * @properties={typeid:35,uuid:"824957A7-1496-483F-B685-63DF3A96B5F1",variableType:-4}
 */
var vIdDittaCommessaFase = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"D0A407F8-6DE4-46AB-88C8-F96E6EABA65B",variableType:8}
 */
var vOre = null;
/**
 * @type {Date}
 * 
 * @properties={typeid:35,uuid:"9A576D68-B79B-48C9-B052-CD398512D759",variableType:93}
 */
var vGiorno = null;
/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"6EE86E85-0116-4430-A50C-6EFC6A967C04"}
 */
var vProprieta = null;

/**
 * @param _firstShow
 * @param _event
 *
 * @properties={typeid:24,uuid:"DF46BFDF-E49E-4689-99B2-337E135A2CEE"}
 */
function onShowForm(_firstShow, _event) 
{ 	
	//inizializzazione valori della form
	vGiorno = globals.TODAY;
	vOre = 0.00;
	vProprieta = "D";
	
	setValueListCommesseLavoratore(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore,vGiorno,vGiorno);
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
	
}

/**
 * Annulla l'inserimento delle ore lavorate per la commessa
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"FD858BC8-5D19-4519-8A0F-33CE4C3B53D5"}
 */
function annullaInserimento(event)
{
	databaseManager.rollbackTransaction();
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Salva le ore inserite per la commessa
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8CC819E9-F92A-474E-AAC5-B2EF5014D8F4"}
 */
function confermaInserimento(event)
{
	try
	{
		var oreDipGiornoCommessa = globals.getOreGiornoDipendenteCommessa(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore
			                                                              ,vIdDittaCommessa
																		  ,vGiorno);

		if(oreDipGiornoCommessa)
		{
			var answer = globals.ma_utl_showYesNoQuestion('Sono state già inserite ' + oreDipGiornoCommessa['ore'] + ' ore per il giorno ' + oreDipGiornoCommessa['giorno'] +'.<br/>\
			                                               Sostituire l\'ultimo valore immesso?' ,'Inserimento ore commessa');
			if(!answer)
			{
				databaseManager.rollbackTransaction();
				globals.svy_mod_closeForm(event);
			}
		}
		
		globals.inserisciOreCommessa(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore
					                 ,utils.dateFormat(vGiorno,globals.ISO_DATEFORMAT)
		                             ,vIdDittaCommessaFase
									 ,vOre
									 ,vProprieta);
		
		globals.ma_utl_setStatus(globals.Status.BROWSE, controller.getName());
		globals.svy_mod_closeForm(event);
	}
	catch (ex)
	{
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message);
		globals.svy_mod_closeForm(event);
	}
}

/**
 * 
 * @param {Number} oldValue
 * @param {Number} newValue
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1B4FFC57-3C8A-45B9-80FE-797D20B9A9A0"}
 */
function onDataChangeOre(oldValue,newValue,event)
{
	return true;
}

/**
 *
 * @param {Date} oldValue old value
 * @param {Date} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6F917257-5955-4427-8FEB-A937731C7C11"}
 */
function onDataChangeGiorno(oldValue, newValue, event) 
{
	setValueListCommesseLavoratore(_to_sec_user$user_id.sec_user_to_sec_user_to_lavoratori.idlavoratore,vGiorno,vGiorno);
	return true
}

/**
 * Imposta i valori della valuelis per la selezione della commessa a cui associare il numero
 * di ore lavorate che si sta inserendo
 * 
 * @param {Number} idLavoratore
 * @param {Date} dal
 * @param {Date} al
 *
 * @properties={typeid:24,uuid:"A067503B-48BA-492B-8AF1-05CAA7AD7D03"}
 */
function setValueListCommesseLavoratore(idLavoratore,dal,al)
{
	var dsCommLav = globals.getFasiCommesseLavoratore(idLavoratore,dal,al);
	var realValues = new Array();
	var displayValues = new Array();
	
	if(dsCommLav && dsCommLav.getMaxRowIndex() > 0)
	{
		realValues = realValues.concat(dsCommLav.getColumnAsArray(1));
		displayValues = displayValues.concat(dsCommLav.getColumnAsArray(2));
	}
	
	application.setValueListItems('vls_commesse_lavoratore',displayValues,realValues);
}