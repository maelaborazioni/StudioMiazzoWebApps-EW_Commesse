/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"10E081B8-9D22-4A2E-878B-4AC8BE5E15CB"}
 */
var vLavoratoriCommesseFasi = '';

/**
 * @type {Array<JSRecord>}
 * 
 * @properties={typeid:35,uuid:"D3DFDBC5-A1D9-4B84-8933-0198A5B4557A",variableType:-4}
 */
var vArrLavoratoriCommesseFasi = [];

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"05924FD7-AFE7-4138-92DD-D37AFF3DA4B3",variableType:4}
 */
var vChkSegueFase = 0;
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3408BF59-A6C4-4778-B4A1-3D66C84D80EC"}
 */
var _codevento = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B4BD303C-152A-4140-AD62-81D3EEEA5678"}
 */
var _descevento = '';

/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"FE886795-E884-4449-8E7E-F6FEFAAACD76",variableType:-4}
 */
var isNuovaFase = false;

/**
 * @type {Number}
 * @properties={typeid:35,uuid:"A53DD58D-803B-45A7-8445-7E27C56E3528",variableType:8}
 */
var _idFasePrecedente = null;
/**
 * @type {String}
 * @properties={typeid:35,uuid:"A8176455-71F1-4C64-81D3-73AFAC5650C5"}
 */
var _codFasePrecedente = null;
/**
 * @type {String}
 * @properties={typeid:35,uuid:"7F3B5F7C-08D8-4A03-8ADA-5BA83F5E075D"}
 */
var _descFasePrecedente = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F0CB8757-4ED8-4AD4-9BAA-47E3B7ACF283"}
 */
function annullaInserimentoFase(event) 
{
	databaseManager.rollbackTransaction();
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
 * @properties={typeid:24,uuid:"EE396CB7-FCCF-40C7-BB30-EB9D94CE0E6D"}
 * @AllowToRunInFind
 */
function confermaInserimentoFase(event)
{
	// controllo preventivo immissione di un codice per la fase
	if(codicefase == null)
	{
		globals.ma_utl_showWarningDialog('Indicare un codice identificativo per la fase','Inserimento fase della commessa')
	    return;
	}
	// controllo preventivo validità delle date di inizio e fine della fase
	var inizioValiditaCommessa = globals.getDataInizialeCommessa(iddittacommessa);
	var fineValiditaCommessa = globals.getDataFinaleCommessa(iddittacommessa);
	if(iniziovaliditafase && finevaliditafase && iniziovaliditafase > finevaliditafase)
	{
		globals.ma_utl_showWarningDialog('La data di inizio della fase non può essere maggiore della data di fine della fase stessa','Inserimento fase della commessa')
	    return;
	}
	if(inizioValiditaCommessa && iniziovaliditafase == null)
	{
		globals.ma_utl_showWarningDialog('La data di inizio della fase non può essere vuota se è stata impostata una data di inizio della commessa','Inserimento fase della commessa')
	    iniziovaliditafase = inizioValiditaCommessa;
	}
	if(fineValiditaCommessa && finevaliditafase == null)
	{
		globals.ma_utl_showWarningDialog('La data di fine della fase non può essere vuota se è stata impostata una data di fine della commessa','Inserimento fase della commessa')
	    finevaliditafase = fineValiditaCommessa;
	}
	if(inizioValiditaCommessa && iniziovaliditafase < inizioValiditaCommessa)
	{
		globals.ma_utl_showWarningDialog('La data di inizio della fase non può precedere la data di inizio della commessa','Inserimento fase della commessa')
	    return;
	}
	if(fineValiditaCommessa && finevaliditafase > fineValiditaCommessa)
	{
		globals.ma_utl_showWarningDialog('La data di fine della fase non può seguire la data di fine della commessa','Inserimento fase della commessa')
	    return;
	}
	
	// controllo eventuale superamento del monte ore per la commessa
	var monteOreCommessa = globals.getMonteOreCommessa(iddittacommessa);
	if(monteOreCommessa && (monteorefase + globals.getTotaleMonteOreCommessaDaFasi(iddittacommessa,iddittacommessafase) > monteOreCommessa))
	{
		globals.ma_utl_showWarningDialog('La somma dei monte ore delle singole fasi non può superare il monte ore della commessa','Inserimento fase della commessa')
	    return;
	}
	
	var params = {
        processFunction: process_inserimento_fase_commessa,
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
 * Inserisce la fase della commessa
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"36D23E57-B22E-427E-B406-1B19F785CC77"}
 */
function process_inserimento_fase_commessa(event)
{
	try
	{
		if(bloccante == null)
			bloccante = 0;
		iddittacommessafaseprecedente = _idFasePrecedente;
		
		if(!databaseManager.commitTransaction())
		{
			databaseManager.rollbackTransaction();
			globals.ma_utl_showWarningDialog('Inserimento non riuscito, si prega di riprovare.','Inserimento fase della commessa');
		}
		else
			databaseManager.refreshRecordFromDatabase(foundset,-1);
		
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
	}
	catch(ex)
	{
		var msg = 'Metodo process_inserimento_fase_commessa : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg)
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"865DEB58-BBF1-4973-9BD2-2B03232C8EA0"}
 */
function filterFasePrecedente(_fs)
{
	_fs.addFoundSetFilterParam('iddittacommessa','=',forms.comm_gestione_commesse_tbl.iddittacommessa);
	_fs.addFoundSetFilterParam('bloccante','=',1);
	if(databaseManager.getEditedRecords().length == 0)
	   _fs.addFoundSetFilterParam('iddittacommessafase','!=',iddittacommessafase);
	return _fs;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param _rec
 *
 * @properties={typeid:24,uuid:"E360ADCC-1E72-465B-9ECD-F21583902C4A"}
 */
function updateFasePrecedente(_rec)
{
	_idFasePrecedente = _rec['iddittacommessafase'];
	_codFasePrecedente = _rec['codicefase'];
	_descFasePrecedente = _rec['descrizionefase'];
}

/**
 * TODO generated, please specify type and doc for the params
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"AA5E2A83-7429-4598-BEB5-F4DC18458BC9"}
 */
function filterLavoratoriTermineFase(_fs)
{
	_fs.addFoundSetFilterParam('idlavoratore','IN',globals.foundsetToArray(forms.comm_gestione_commesse_fasi_lavoratori_tbl.foundset,'idlavoratore')); 
	return _fs;
}

/**
 *
 * @param {Boolean} _firstShow
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"04CF01D3-F72A-4015-9CB1-CF727298CA9A"}
 */
function onShowForm(_firstShow, _event) 
{
	_super.onShowForm(_firstShow, _event);
	
	plugins.busy.prepare();
	
	// visualizzazione dati caso fase preceduta da altra fase
	if(iddittacommessafaseprecedente)
	{
		vChkSegueFase = 1;
		_idFasePrecedente = iddittacommessafaseprecedente;
		_codFasePrecedente = globals.getCodiceFaseCommessaDitta(_idFasePrecedente);
		_descFasePrecedente = globals.getDescrizioneFase(_idFasePrecedente);
	}
	else
	{
		vChkSegueFase = 0;
		_idFasePrecedente = null;
		_codFasePrecedente = null;
		_descFasePrecedente = null;
	}
	
	// visualizzazione caso fase terminata
	elements.fld_codice.enabled = 
		elements.fld_nominativo.enabled = 
			elements.btn_lkp_lavoratore.enabled = terminata ? 1 : 0;
		
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
 * @private
 *
 * @properties={typeid:24,uuid:"609071D6-AC1A-45AB-8B66-65452C7B7232"}
 */
function onDataChangeSegueFase(oldValue, newValue, event) 
{
	if(newValue)
	   elements.btn_lk_fase.enabled = true;
	else
	{
		_idFasePrecedente = null;
		_codFasePrecedente = null;
		_descFasePrecedente = null;
	}
	return true
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
 * @private
 *
 * @properties={typeid:24,uuid:"4F8C5528-9AFB-46A7-97DF-90F22624A37C"}
 */
function onDataChangeTerminata(oldValue, newValue, event) 
{
	elements.fld_codice.enabled = elements.fld_nominativo.enabled = elements.btn_lkp_lavoratore.enabled = newValue;
	
	if(newValue == 0)
	{
		terminatada = null;
	}
	
	return true;
}
