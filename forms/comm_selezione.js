
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"34208844-E99B-4177-B62C-447360ECA153"}
 */
function confermaSelezioneDittaPeriodoCommesse(event) 
{
	// Controlla che i campi siano compilati
	if(!isFilled())
	{
		globals.ma_utl_showWarningDialog('Controllare che tutti i campi siano compilati correttamente', 'i18n:hr.msg.attention');
		return;
	}
	
	var params = {
        processFunction: process_apri_programmazione_commessa,
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
 * @properties={typeid:24,uuid:"8E5703E0-6CA0-4FCF-8692-63CFF16C15DE"}
 */
function process_apri_programmazione_commessa(event)
{
	try
	{
		globals.ma_utl_setStatus(globals.Status.BROWSE,controller.getName());
		globals.svy_mod_closeForm(event);
		
		var _periodo = globals.toPeriodo(_anno, _mese);
		var fineInizioGestionePresenze = globals.getPeriodoFinaleGestionePresenze(globals.getDitta(idlavoratore));
		if(fineInizioGestionePresenze != null && _periodo > fineInizioGestionePresenze)
		{
			globals.ma_utl_showWarningDialog('Non è possibile utilizzare la funzionalità oltre il periodo di fine gestione','Giornaliera elettronica');
			return;
		}
		
		//Salva la selezione corrente per poterla riproporre nella prossima prog. commesse	
		salvaSelezione(_codditta.toString(),_anno,_mese,_idgruppoinst,_codgrlav);
		
		// Apri il program della programmazione commesse che sarà disabilitato
		globals.apriProgrammazioneCommesse(event, _idditta, _anno, _mese, _codgrlav, _idgruppoinst);
	}	
	catch(ex)
	{
		var msg = 'Metodo process_apri_programmazione_commessa : ' + ex.message;
		globals.ma_utl_showErrorDialog(msg);
		globals.ma_utl_logError(msg,LOGGINGLEVEL.ERROR);
	}
	finally
	{
		plugins.busy.unblock();
	}
}


