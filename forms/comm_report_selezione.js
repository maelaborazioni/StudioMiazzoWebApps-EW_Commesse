/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"962805C6-2671-49AB-A449-8CF931B5ED36",variableType:8}
 */
var vMeseDal = null;
/**
 * @type {Number}
 *  
 * @properties={typeid:35,uuid:"B53DB3DA-978D-4FCE-B09C-D17ED7D8F1CC",variableType:8}
 */
var vMeseAl = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"167035FB-B30E-42D1-BEFF-DA41C2A9ACA1",variableType:8}
 */
var vAnnoDal = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"2AF0FCB1-CCEF-4DBE-B3F5-CEE23A407734",variableType:8}
 */
var vAnnoAl = null;
/**
 * @type {Array<Number>}
 * 
 * @properties={typeid:35,uuid:"514FCDB1-17E5-4C5D-9C19-713F4A47A264",variableType:-4}
 */
var vArrCommesse = [];
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"0E96D531-0048-4739-A0AB-B2185CA16B9F",variableType:4}
 */
var vChkDettaglioLavoratori = 1;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"53B17871-A90D-4549-B261-A3AE2A18F438",variableType:4}
 */
var vChkSoloConsolidate = 0;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A06E3616-375B-4D8A-8677-51F1C069B783",variableType:4}
 */
var vChkSoloAutorizzate = 0;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"18FC0431-4248-48AE-A812-1B3831C102ED",variableType:4}
 */
var vChkSoloFatturabili = 0;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"DC2FD8C0-75D5-41F8-89B1-EE17AC48A089",variableType:4}
 */
var vChkDettaglioFasi = 0;
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"12CF7605-7CFE-4219-BC32-29314A16EB0C"}
 */
var vCommesse = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"02AFBE3F-8B82-42ED-94A9-634ECA18CC32",variableType:4}
 */
var vFormat = 0;
/**
 * Aggiorna la visualizzazione delle commesse selezionate per l'inserimento
 * 
 * @param {Array<JSRecord<db:/ma_anagrafiche/ditte_commesse>>} _recs
 *
 * @properties={typeid:24,uuid:"B910A77F-AE08-423B-8131-30F37FF758C7"}
 */
function updateDitteCommesseReport(_recs)
{ 
	vCommesse = '';
	vArrCommesse = [];
	vArrCommesse = _recs;
	for (var c = 0; c < _recs.length; c++)
		vCommesse += (globals.getCodiceCommessaDitta(_recs[c].iddittacommessa) + ' - ' + globals.getDescrizioneCommessa(_recs[c].iddittacommessa) + '\n');
	
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3E95D287-9E33-4E85-AF96-491681BDD032"}
 */
function onActionAnnulla(event) 
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
 * @properties={typeid:24,uuid:"C252CC67-AD1F-4320-B73C-08CF4468ABD6"}
 */
function onActionConferma(event) 
{
	var params = {
        processFunction: process_report_situazione_ore,
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
 * @properties={typeid:24,uuid:"16B5E8D4-99A2-47FD-9E52-318E79FD9EED"}
 */
function process_report_situazione_ore(event)
{
	try
	{
		var soloConsolidate = vChkSoloConsolidate == 1 ? true : false;
		var soloAutorizzate = vChkSoloAutorizzate == 1 ? true : false;
		var soloFatturabili = vChkSoloFatturabili == 1 ? true : false;
			
		// lancio dei reports
		switch(vFormat)
		{
			case 0: 
				if(vChkDettaglioLavoratori)
				{
					if(vChkDettaglioFasi) 
						scopes.comm_reports.exportReportMensileLavoratoriCommesseFasi(vArrCommesse,vMeseDal,vMeseAl,vAnnoDal,vAnnoAl,soloConsolidate,soloAutorizzate,soloFatturabili);	
					else 
						scopes.comm_reports.exportReportMensileLavoratoriCommesse(vArrCommesse,vMeseDal,vMeseAl,vAnnoDal,vAnnoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
				}
				else
				{
					if(vChkDettaglioFasi) 
						scopes.comm_reports.exportReportMensileCommesseFasi(vArrCommesse,vMeseDal,vMeseAl,vAnnoDal,vAnnoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
					else 
						scopes.comm_reports.exportReportMensileCommesse(vArrCommesse,vMeseDal,vMeseAl,vAnnoDal,vAnnoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
				}
				break;
			    
			case 1:
				if(vChkDettaglioLavoratori)
				{
					if(vChkDettaglioFasi)
					   scopes.comm_reports.createExcelMensileLavoratoriCommesseFasi(vArrCommesse,vMeseDal,vMeseAl,vAnnoDal,vAnnoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
					else
					   scopes.comm_reports.createExcelMensileLavoratoriCommesse(vArrCommesse,vMeseDal,vMeseAl,vAnnoDal,vAnnoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
				}
				else
				{
					if(vChkDettaglioFasi)
					   scopes.comm_reports.createExcelMensileCommesseFasi(vArrCommesse,vMeseDal,vMeseAl,vAnnoDal,vAnnoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
					else
	                   scopes.comm_reports.createExcelMensileCommesse(vArrCommesse,vMeseDal,vMeseAl,vAnnoDal,vAnnoAl,soloConsolidate,soloAutorizzate,soloFatturabili);
				}
				break;
			    
			default:
				break;
		}
		
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_chiusura_mese : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} svyNavBaseOnShow
 *
 * @properties={typeid:24,uuid:"71AED4FE-6505-45EF-ABB5-5DD487BE2E2C"}
 * @AllowToRunInFind
 */
function onShowForm(firstShow, event, svyNavBaseOnShow) 
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	
	plugins.busy.prepare();
	
	if(firstShow)
	{
		var today = globals.TODAY;
		vAnnoDal = today.getFullYear();
		vAnnoAl = today.getFullYear();
		vMeseDal = today.getMonth() + 1;
		vMeseAl = today.getMonth() + 1;
	}
	
	/** @type {JSFoundset<db:/ma_anagrafiche/ditte_commesse>} */
	var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE_COMMESSE);
	if(fs.find())
	{
		fs.search();
		vArrCommesse = globals.foundsetToArray(fs,'iddittacommessa');
	    vCommesse = '';
	}
	
	if(globals.ma_utl_hasKey(globals.Key.COMMESSE_AUTORIZZA))
	{
		elements.chk_soloautorizzate.visible = true;
		elements.lbl_solooreautorizzate.visible = true;
	}
	else
	{
		elements.chk_soloautorizzate.visible = false;
		elements.lbl_solooreautorizzate.visible = false;
	}
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"ABE56D81-9DE3-4AF7-94C5-88B2AD9554DF"}
 */
function onHide(event)
{
	onActionAnnulla(event);
}
