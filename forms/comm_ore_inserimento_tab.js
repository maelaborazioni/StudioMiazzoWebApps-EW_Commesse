/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"8410EBCA-AFFC-478D-9ED2-30D1DA50B8C8"}
 */
function annullaInserimento(event)
{
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.enabled = true;
	forms.comm_ore_inserimento_tab.elements.tab_inserimento.toolTipText = '';
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
}

/**
 * Conferma l'inserimento 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"FA3EC7DB-7160-4C93-AAF4-CB276F30EFAB"}
 */
function confermaInserimento(event) 
{
	var params = {
        processFunction: process_conferma_ore_commesse,
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
 * @properties={typeid:24,uuid:"3FDB2909-D528-4FBE-970F-AA1CD784C779"}
 */
function process_conferma_ore_commesse(event)
{
	try
	{
	elements.btn_conferma_inserimento.enabled = false;
	
	var frmSel = globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) ? forms.comm_ore_inserimento_selezione : forms.comm_ore_inserimento_utente_selezione;
	var totGiorni = globals.dateDiff(frmSel.vDal,frmSel.vAl,1000 * 60 * 60 * 24);
	var frmName = elements.tab_inserimento.getTabFormNameAt(1);// forms['comm_ore_lavoratore_commesse_tbl'];
	var frm = forms[frmName];
	var fs = frm.foundset;
	var arrCommesseFasi = frmSel.vArrCommesseFasi;
	var currRec;
	var msgRiepilogoInserimento = '';
	
	setStatusWarning('Salvataggio dati in corso, attendere...');
	
	for (var g = 1; g <= totGiorni; g++)
	{
		var giorno = new Date(frmSel.vDal.getFullYear(),frmSel.vDal.getMonth(),frmSel.vDal.getDate() + g - 1);
		var giornoIso = utils.dateFormat(giorno,globals.ISO_DATEFORMAT);
		var totOreGiorno = 0;
		var currOreGiornoCommessaStatus = true;
		
		for(var c = 0; c < arrCommesseFasi.length; c++)
		{
			currRec = fs.getRecord(c + 1);
			var currOre = currRec['commessa_' + g] == null ? null : parseInt(currRec['commessa_' + g],10);
		    if(currOre != null)
		    	totOreGiorno += currOre;
		}
		if(totOreGiorno > 13)
		{
			msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + 
								        ',Ore di lavoro : ' + totOreGiorno + ' - ERRORE : il numero massimo di ore giornaliere lavorabili è stato superato \n');
	        currOreGiornoCommessaStatus = false;
		}
		
		for(c = 0; c < arrCommesseFasi.length; c++)
		{
			var recDittaCommessaFase = globals.getDittaCommessaFase(arrCommesseFasi[c]);
			var codComm = recDittaCommessaFase.ditte_commesse_fasi_to_ditte_commesse.codice;
			var descComm = recDittaCommessaFase.ditte_commesse_fasi_to_ditte_commesse.descrizione;
			var codFase = recDittaCommessaFase.codicefase;
			var descFase = recDittaCommessaFase.descrizionefase;
			
			// controllo su validità inserimento nel giorno per la commessa
			var dataInizialeComm = globals.getDataInizialeCommessa(recDittaCommessaFase.iddittacommessa);
			var dataFinaleComm = globals.getDataFinaleCommessa(recDittaCommessaFase.iddittacommessa);
					
			currRec = fs.getRecord(c + 1);
						
			var ore = currRec['commessa_' + g] == null ? null : parseInt(currRec['commessa_' + g],10);
			if(ore != null)
			{
				totOreGiorno += ore;
								
				// verifica se commessa terminata manualmente
				var isCommessaTerminata = globals.getChiusuraCommessa(recDittaCommessaFase.iddittacommessa);
				if(isCommessaTerminata)
				{
	    			msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + 
	    					                    ',Ore di lavoro : ' + ore + ' - ERRORE : la commessa ' + codComm + ' - ' + descComm + 
												'risulta terminata \n');
				    currOreGiornoCommessaStatus = false;
				}
				
				// verifica se la fase ha una fase precedente bloccante non ancora terminata
				if(recDittaCommessaFase.iddittacommessafaseprecedente)
					if(globals.getChiusuraFaseCommessa(recDittaCommessaFase.iddittacommessafaseprecedente) != 1
					   && globals.getBloccanteFaseCommessa(recDittaCommessaFase.iddittacommessafaseprecedente) == 1)
					{
						msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + 
								                    ',Ore di lavoro : ' + ore + ' - ERRORE : la fase della commessa ' + codFase + ' - ' + descFase + 
													'segue una fase precedente che è bloccante e risulta non ancora terminata \n');
						currOreGiornoCommessaStatus = false;
					}
				
				if (dataInizialeComm && giorno < dataInizialeComm) 
				{	
					msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + 
							                    ',Ore di lavoro : ' + ore + ' - ERRORE : la commessa ' + codComm + ' - ' + descComm + 
												' non risulta ancora programmabile per il giorno selezionato \n');
				    currOreGiornoCommessaStatus = false;
				}
				
				if(dataFinaleComm && giorno > dataFinaleComm)
				{	
					msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + 
							                    ',Ore di lavoro : ' + ore + ' - ERRORE : la commessa ' + codComm + '-' + descComm +
												' non risulta più programmabile per il giorno selezionato \n');
				    currOreGiornoCommessaStatus = false;
				}
				
				// controllo su validità inserimento nel giorno per la fase
				var dataInizialeFaseComm = globals.getDataInizialeFaseCommessa(recDittaCommessaFase.iddittacommessafase);
				var dataFinaleFaseComm = globals.getDataFinaleFaseCommessa(recDittaCommessaFase.iddittacommessafase);
				
				// verifica se fase della commessa terminata manualmente
				var isFaseCommessaTerminata = globals.getChiusuraFaseCommessa(recDittaCommessaFase.iddittacommessafase);
				if(isFaseCommessaTerminata)
				{
					msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + 
							                   ',Ore di lavoro : ' + ore + ' - ERRORE : la fase ' + codFase + ' - ' + descFase +
											   ' della commessa ' + codComm + ' - ' + descComm + ' risulta terminata \n');
					currOreGiornoCommessaStatus = false;
				}
				
				// verifica se la fase ha una fase precedente bloccante non ancora terminata
				if(recDittaCommessaFase.iddittacommessafaseprecedente)
					if(globals.getChiusuraFaseCommessa(recDittaCommessaFase.iddittacommessafaseprecedente) != 1
					   && globals.getBloccanteFaseCommessa(recDittaCommessaFase.iddittacommessafaseprecedente) == 1)
					{
						msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + 
								                    ',Ore di lavoro : ' + ore + ' - ERRORE : la fase ' + codFase + ' - ' + descFase +
											        ' della commessa ' + codComm + ' - ' + descComm + ' segue una fase precedente che è bloccante e risulta non ancora terminata \n');			
						currOreGiornoCommessaStatus = false;
					}
				
				if (dataInizialeFaseComm && giorno < dataInizialeFaseComm)
				{
					msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + 
	    					                   ',Ore di lavoro: ' + ore + ' - ERRORE : la fase ' + codFase + ' - ' + descFase +
											   ' della commessa ' + codComm + ' - ' + descComm + ' risulta ancora programmabile per il giorno selezionato \n');
					currOreGiornoCommessaStatus = false;
				}
				
				if(dataFinaleFaseComm && giorno > dataFinaleFaseComm)
				{
					msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + 
							                   ',Ore di lavoro : ' + ore + ' - ERRORE : la fase ' + codFase + ' - ' + descFase +
											   ' della commessa ' + codComm + ' - ' + descComm + ' della commessa non risulta più programmabile per il giorno selezionato \n');
					currOreGiornoCommessaStatus = false;
				}
			}
			
			if(currOreGiornoCommessaStatus)
			{
				if(!globals.isStatoOreFaseCommessaConsolidato(forms.comm_lav_header_dtl.idlavoratore
					                                         ,giorno
															 ,recDittaCommessaFase.iddittacommessafase)
					|| globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE)										 )
				{
					if(!globals.inserisciOreCommessa(forms.comm_lav_header_dtl.idlavoratore
									         		 ,giornoIso
											         ,recDittaCommessaFase.iddittacommessafase
											         ,ore
											         ,globals.ProprietaEventoBase.DIURNO))
					       msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + ',Ore : ' + ore + ' - non inserite : inserimento non riuscito per la fase \n');
				}
				else
					 msgRiepilogoInserimento += ('Giorno : ' + globals.dateFormat(giorno,globals.EU_DATEFORMAT) + ',Ore : ' + ore + ' - non inserite : ore precedentemente consolidate dal responsabile \n');
			}
		}
				
	}
	
	globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
	globals.svy_mod_closeForm(event);
	
	if(msgRiepilogoInserimento.length > 0)
		forms.ma_status_message_dtl.showMessage(event, msgRiepilogoInserimento);
	
	forms.comm_ore_inserimento_rapido.elements.tab_inserimento.enabled = true;
	forms.comm_ore_inserimento_rapido.elements.tab_inserimento.toolTipText = '';
	
	globals.preparaInserimentoOreCommesseLavoratore(event,
											        forms.comm_lav_header_dtl.idlavoratore,
													frmSel.vArrCommesseFasi,
													frmSel.vDal,
											        frmSel.vAl,
													frmSel.vArrFestivita,
													true,
													false,
													frmSel.dxEvComm);
	globals.preparaInserimentoOreCommesseLavoratoreRiepilogo(event,
											        forms.comm_lav_header_dtl.idlavoratore,
													frmSel.vArrCommesseFasi,
													frmSel.vDal,
											        frmSel.vAl,
													frmSel.vArrFestivita,
													true,
													frmSel.dxEvComm);	
	}
	catch(ex)
	{
		var msg = 'Metodo process_conferma_ore_commesse : ' + ex.message;
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
 * @properties={typeid:24,uuid:"D57FA1D1-6505-4059-8005-8F6F648B12A9"}
 */
function onShowForm(firstShow, event, svyNavBaseOnShow)
{
	_super.onShowForm(firstShow, event, svyNavBaseOnShow)
    if(firstShow)
    {
    	// TODO se non forziamo il ridisegno delle ore e del riepilogo delle commesse la prima volta che viene visualizzato,
    	// quando è già presente un tab precedentemente aperto, allo stesso riepilogo viene applicato, contrariamente 
    	// a quanto programmato, il background di default...
    	var frmSel = globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE) ? forms.comm_ore_inserimento_selezione : forms.comm_ore_inserimento_utente_selezione;
    	
    	globals.preparaInserimentoOreCommesseLavoratore(event,
												        forms.comm_lav_header_dtl.idlavoratore,
														frmSel.vArrCommesseFasi,
														frmSel.vDal,
												        frmSel.vAl,
														frmSel.vArrFestivita,
														true,
														false,
														frmSel.dxEvComm);
    	
    	globals.preparaInserimentoOreCommesseLavoratoreRiepilogo(event,
														        forms.comm_lav_header_dtl.idlavoratore,
																frmSel.vArrCommesseFasi,
																frmSel.vDal,
														        frmSel.vAl,
																frmSel.vArrFestivita,
																true,
																frmSel.dxEvComm);
    }
    	
}
