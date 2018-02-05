/**
 * @properties={typeid:35,uuid:"F09A0E5E-F6D8-4463-82AA-241F081CFBA3",variableType:-4}
 */
var bUtente = false;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"755BF8CE-2705-4B89-B7E7-DF77FDA45376",variableType:4}
 */
var chkStatoOreInserite = 1;
/**
 * @type {Boolean}
 * 
 * @properties={typeid:35,uuid:"1EF9C5BB-65BF-4342-B081-C3038F7C1428",variableType:-4}
 */
var serveRidisegno = false;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5F24C8EC-D372-4FEE-8A77-1BFB1D7FDE77",variableType:4}
 */
var dxEvComm = 35;
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"32793034-3472-45C9-9995-4E4C3FC5FC9B"}
 */
function confermaSelezioneRefresh(event) 
{
	if(validaSelezioneOpzioni(true))
	{
		var params = {
	        processFunction: process_refresh_ore_commesse,
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
	else
		globals.ma_utl_showWarningDialog('Controllare i parametri inseriti','Inserimento ore commesse lavoratore');
}

/**
 * @param {JSEvent} event
 * 
 * @properties={typeid:24,uuid:"8CF66256-1ADB-49D6-94B5-E8CDEDF7CFFF"}
 */
function process_refresh_ore_commesse(event)
{
	try
	{
	// azzeriamo eventuali comunicazioni ancora visibili
	forms.comm_ore_inserimento_tab.setStatusNeutral();
	
	elements.btn_annulla_inserimento.enabled =  false;
	elements.btn_refresh.enabled = false;
	elements.btn_edit.enabled = true;
	elements.btn_calendar_dal.enabled = false;
	elements.btn_calendar_al.enabled = false;
	elements.btn_lkp_commesse.enabled = false;
			
	// aggiornamento festività
	var idLavoratore = forms.comm_lav_header_dtl.idlavoratore;
	var numGiorni = globals.dateDiff(vDal,vAl,1000 * 60 * 60 * 24);
	var arrFestivi = [];
	/** Array<Number> */
	var arrPeriodi = new Array();
	for(var g = 1;g <= numGiorni; g++)
	{
		var giorno = new Date(vDal.getFullYear(),vDal.getMonth(),vDal.getDate() + g - 1);
	    var currPeriodo = giorno.getFullYear() * 1000 + giorno.getMonth() + 1;
	    if(arrPeriodi.indexOf(currPeriodo) == -1)
	       arrPeriodi.push(currPeriodo);
	}
		
	for(var i = 0; i < arrPeriodi.length; i++)
	{
		var arrFestiviPeriodo = globals.getFestivitaDipendente(globals.getDitta(idLavoratore)
			                                                   ,idLavoratore
															   ,arrPeriodi[i]);
	    for(var fp = 0; fp < arrFestiviPeriodo.length; fp++)
	    {
	    	var anno = globals.getAnnoDaPeriodo(arrPeriodi[i]);
	    	var mese = globals.getMeseDaPeriodo(arrPeriodi[i]);
	    	arrFestivi.push(new Date(anno, mese - 1,arrFestiviPeriodo[fp]));
	    }
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.preparaInserimentoOreCommesseLavoratore(event,
		                                            forms.comm_lav_header_dtl.idlavoratore,
													vArrCommesseFasi,
													vDal,
													vAl,
													arrFestivi,
													serveRidisegno,
													null,
													dxEvComm);
	globals.preparaInserimentoOreCommesseLavoratoreRiepilogo(event,
												            forms.comm_lav_header_dtl.idlavoratore,
															vArrCommesseFasi,
															vDal,
															vAl,
															arrFestivi,
															null,
															dxEvComm);
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.enabled = true;
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.toolTipText = '';
	}
	catch(ex)
	{
		var msg = 'Metodo process_refresh_ore_commesse : ' + ex.message;
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
 * @properties={typeid:24,uuid:"0C18C256-CA26-4AD5-836D-2FC310618F5D"}
 */
function onActionGoToEdit(event)
{
	elements.btn_annulla_inserimento.enabled = true;
	elements.btn_refresh.enabled = true;
	elements.btn_edit.enabled = false;
	elements.btn_calendar_dal.enabled = true;
	elements.btn_calendar_al.enabled = true;
	elements.btn_lkp_commesse.enabled = true;
	
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.enabled = false;
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.toolTipText = 'Non sarà possibile inserire valori prima di aver selezionato periodo e commesse da inserire';
	
	globals.ma_utl_setStatus(globals.Status.EDIT,controller.getName());
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"14E59B88-E83D-4AD2-97B4-DFF064695DC9"}
 */
function onActionAnnulla(event) 
{
	elements.btn_annulla_inserimento.enabled = false;
	elements.btn_refresh.enabled = false;
	elements.btn_edit.enabled = true;
	elements.btn_calendar_dal.enabled = false;
	elements.btn_calendar_al.enabled = false;
	elements.btn_lkp_commesse.enabled = false;
	
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.enabled = true;
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.toolTipText = '';
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D00A95FA-5EB3-4C25-9280-1ABC6B18B76C"}
 */
function onActionImportaTracciatoOreCommesse(event) 
{
	var msg = 'Eventuali ore precedentemente inserite saranno sovrascritte dall\'importazione.\n Procedere comunque?';
	var answer = globals.ma_utl_showYesNoQuestion(msg,'Importazione tracciato ore commesse');
	if(answer)
	   plugins.file.showFileOpenDialog(null,null,false,null,globals.importaTracciatoOreCommesse,'Seleziona file tracciato da importare');
}

/**
 * Invia la situazione delle ore inserite su commessa ai dipendenti 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"4F1B24B6-B938-4CCD-A0EF-BEA458F542D5"}
 */
function onActionInviaReport(event) 
{
	var frm = forms.comm_invia_report_selezione;
	globals.ma_utl_showFormInDialog(frm.controller.getName(),'Seleziona i periodi per il report');
}

/**
 * Consolida le ore su commesse visualizzate per il dipendente 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E046FE5F-CC5D-4DB1-BEB7-E93E17AA5970"}
 * @AllowToRunInFind
 */
function onActionConsolidaOreCommessaUtente(event)
{
	// Consolida le ore del dipendente selezionato
	var msg = 'Consolidamento ore su commesse dal ' + globals.dateFormat(vDal,globals.EU_DATEFORMAT) + 
	          ' al ' + globals.dateFormat(vAl,globals.EU_DATEFORMAT);
	
	if(globals.TODAY < vAl)
	{
		globals.ma_utl_showWarningDialog('Non è possibile consolidare periodi non ancora terminati','Consolidamento ore su commesse');
		return;
	}
	          
	var success = globals.consolidaStatoOreFaseCommessa([forms.comm_lav_header_dtl.idlavoratore],vDal,vAl);
	
	if(success)
	{
		globals.preparaInserimentoOreCommesseLavoratore(event
			                                            ,forms.comm_lav_header_dtl.idlavoratore
														,vArrCommesseFasi
														,vDal
														,vAl
														,vArrFestivita
														,serveRidisegno
														,null
														,dxEvComm);
		
		globals.ma_utl_showInfoDialog(msg + ' avvenuto!','Consolidamento ore su commesse');
	}
	else
		globals.ma_utl_showErrorDialog(msg + 'non avvenuto, si prega di riprovare.','Consolidamento ore su commesse');
}

/**
 * Consolida le ore su commesse visualizzate per il dipendente 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"F4011B60-98C3-4865-AA26-486CEC23BEED"}
 * @AllowToRunInFind
 */
function onActionConsolidaOreCommessaGestore(event)
{
	// visualizza le eventuali ore ancora da consolidare
	var isGestore = globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE);
	var frm = forms.giorn_comm_cons_giornalieraore_tab;
	var frmOpt = isGestore ? forms.comm_ore_inserimento_selezione : forms.comm_ore_inserimento_utente_selezione;
	var fs = frm.foundset;
	if(fs.find())
	{
		fs.consolidato = 0;
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.idlavoratore = forms.comm_lav_header_dtl.idlavoratore;
		fs.commesse_giornaliera_ore_to_commesse_giornaliera.giorno = globals.dateFormat(frmOpt.vDal,globals.ISO_DATEFORMAT) + '...' + 
		                                                             globals.dateFormat(frmOpt.vAl,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		var numOreFasiDaCons = fs.search();
		if(numOreFasiDaCons)
		{
		  	fs.sort('commesse_giornaliera_ore_to_commesse_giornaliera.giorno asc');
            globals.ma_utl_showFormInDialog(frm.controller.getName(),'Gestione ore non consolidate');
		}
		else
		   globals.ma_utl_showWarningDialog('Tutte le ore inserite nel periodo considerato sono state consolidate','Gestione ore non consolidate');	
	}
	
}

/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 * @param {Boolean} svyNavBaseOnShow
 *
 * @properties={typeid:24,uuid:"98274681-7845-443A-8FFE-641BA925EC5C"}
 */
function onShowForm(firstShow, event, svyNavBaseOnShow)
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow);
	
	plugins.busy.prepare();
	
	if(firstShow && event.getFormName() == 'comm_ore_inserimento_selezione')
	{
		elements.btn_consolida_commesse.enabled = globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE);
		elements.btn_pannello_controllo.enabled = globals.ma_utl_hasKey(globals.Key.COMMESSE_COMPILA_GIORNALIERA);
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3CF2A131-3C41-4DA7-BB62-21DC81A8626A"}
 */
function onActionGoToPannelloGiornaliera(event) 
{
	// EW_Commesse dovrebbe essere un modulo non dipendente da EW_Giornaliera (ma viceversa)
	// pertanto non dovrebbe poter passare alla giornaliera...
//	globals.apriGiornaliera(event
//		                    ,globals.getDitta(forms.comm_lav_header_dtl.idlavoratore)
//							,vDal.getFullYear()
//							,vDal.getMonth() + 1
//							,vDal.getFullYear()
//							,vDal.getMonth() + 1
//							,globals.getGruppoInstallazioneLavoratore(forms.comm_lav_header_dtl.idlavoratore)
//							,'');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A68333F9-4D5C-45F6-BB2F-263EA211E258"}
 */
function onActionGestioneAutorizzazioneOreCommessa(event)
{
	// Apri la gestione delle autorizzazioni e della fatturazione
	/** @type Array<Number> */
	var arr = globals.foundsetToArray(forms.comm_lav_header_dtl.foundset,'idlavoratore');
	globals.gestioneAutorizzazioneCommesse(vDal,vAl,arr);
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
 * @properties={typeid:24,uuid:"1AFC2F2D-0CE7-42F2-AE0F-8709E28BC110"}
 */
function onDataChangeGiorno(oldValue, newValue, event) 
{
	if(vDal && vAl)
	{
		if(vDal > vAl)
			return false;
		// aggiornamento commesse selezionabili
		var dsCommLav = globals.getFasiCommesseLavoratore(forms.comm_lav_header_dtl.idlavoratore,vDal,vAl);
		var arrCommLav = dsCommLav.getColumnAsArray(1);
		vArrCommesseFasi = arrCommLav;
		updateDitteCommesseFasi(arrCommLav);
	}
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A0E9CD0B-EBDD-4B09-8344-26C07B3C3C20"}
 */
function onActionGoToInserimentoRapido(event)
{	
	plugins.WebClientUtils.setExtraCssClass(forms.comm_ore_inserimento_tab.elements.tab_riepilogo, 'disabled');

	if(validaSelezioneOpzioni(true))
	{
		elements.btn_annulla_inserimento.enabled =  false;
		elements.btn_refresh.enabled = false;
		elements.btn_edit.enabled = true;
		elements.btn_calendar_dal.enabled = false;
		elements.btn_calendar_al.enabled = false;
		elements.btn_lkp_commesse.enabled = false;
		
		// aggiornamento festività
		var idLavoratore = forms.comm_lav_header_dtl.idlavoratore;
		var numGiorni = globals.dateDiff(vDal,vAl,1000 * 60 * 60 * 24);
		var arrFestivi = [];
		/** Array<Number> */
		var arrPeriodi = new Array;
		for(var g = 1; g <= numGiorni; g++)
		{
			var giorno = new Date(vDal.getFullYear(),vDal.getMonth(),vDal.getDate() + g - 1);
		    var currPeriodo = giorno.getFullYear() * 1000 + giorno.getMonth() + 1;
		    if(arrPeriodi.indexOf(currPeriodo) == -1)
		       arrPeriodi.push(currPeriodo);
		}
			
		for(var i = 0; i < arrPeriodi.length; i++)
		{
			var arrFestiviPeriodo = globals.getFestivitaDipendente(globals.getDitta(idLavoratore)
				                                                   ,idLavoratore
																   ,arrPeriodi[i]);
		    for(var fp = 0; fp < arrFestiviPeriodo.length; fp++)
		    {
		    	var anno = globals.getAnnoDaPeriodo(arrPeriodi[i]);
		    	var mese = globals.getMeseDaPeriodo(arrPeriodi[i]);
		    	arrFestivi.push(new Date(anno, mese - 1,arrFestiviPeriodo[fp]));
		    }
		}
		
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.preparaInserimentoOreCommesseLavoratore(event,
			                                            forms.comm_lav_header_dtl.idlavoratore,
														vArrCommesseFasi,
														vDal,
														vAl,
														arrFestivi,
														serveRidisegno,
														true,
														dxEvComm);

		globals.ma_utl_showFormInDialog(forms.comm_ore_inserimento_rapido.controller.getName(),
			                            'Inserimento rapido ore',
										null,
										true,
										100 + (numGiorni + 1) * 40 + 5);
	}
	else
		globals.ma_utl_showWarningDialog('Controllare i parametri inseriti','Inserimento ore commesse lavoratore');
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
 * @properties={typeid:24,uuid:"E3F02A74-8A5F-4E19-95D9-D4C3679BCC80"}
 */
function onDataChangeChkStatoOre(oldValue, newValue, event) 
{
	if(oldValue != newValue)
		serveRidisegno = true;
	return true
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2FD038D2-CC38-4FB6-A70D-F5533D58A798"}
 */
function onActionIncrementSize(event) 
{
	dxEvComm += 3; 
	globals.preparaInserimentoOreCommesseLavoratore(event
		                                            ,forms.comm_lav_header_dtl.idlavoratore
													,vArrCommesseFasi
													,vDal
													,vAl
													,vArrFestivita
													,true
													,false
													,dxEvComm);
	globals.preparaInserimentoOreCommesseLavoratoreRiepilogo(event
		                                                     ,forms.comm_lav_header_dtl.idlavoratore
															 ,vArrCommesseFasi
															 ,vDal
															 ,vAl
															 ,vArrFestivita
															 ,true
															 ,dxEvComm);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"04FCCA94-B413-41CA-88F8-5AC495957118"}
 */
function onActionDecrementSize(event) 
{
	dxEvComm -= 3;
	globals.preparaInserimentoOreCommesseLavoratore(event
											        ,forms.comm_lav_header_dtl.idlavoratore
													,vArrCommesseFasi
													,vDal
													,vAl
													,vArrFestivita
													,true
													,false
													,dxEvComm);
	globals.preparaInserimentoOreCommesseLavoratoreRiepilogo(event
													        ,forms.comm_lav_header_dtl.idlavoratore
															 ,vArrCommesseFasi
															 ,vDal
															 ,vAl
															 ,vArrFestivita
															 ,true
															 ,dxEvComm);
}
