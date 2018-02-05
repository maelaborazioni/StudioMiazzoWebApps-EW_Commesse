/**
 *
 * @param {JSEvent} event
 * @param _form
 * @param {Boolean} _soloCartolina
 *
 * @properties={typeid:24,uuid:"453D014E-A875-4B5D-9C69-9CC9DC2899F4"}
 */
function onRecordSelection(event, _form, _soloCartolina)
{
	_super.onRecordSelection(event, _form, _soloCartolina);
	
	var isGestore = globals.ma_utl_hasKey(globals.Key.COMMESSE_GESTORE);
	// l'utente dipendente non ha accesso ai menu di anagrafica ditta e dipendente
	elements.btn_anagdittagiorn.visible = elements.btn_anaglavgiorn.visible = 
	elements.btn_lkp_dipendente.enabled = isGestore;
	
	var frm = isGestore ? forms.comm_ore_inserimento_selezione : forms.comm_ore_inserimento_utente_selezione;
	
	// aggiornamento festività
	var numGiorni = globals.dateDiff(frm.vDal,frm.vAl,1000 * 60 * 60 * 24);
	frm.vArrFestivita = [];
	/** Array<Number> */
	var arrPeriodi = new Array;
	for(var g = 1; g <= numGiorni; g++)
	{
		var giorno = new Date(frm.vDal.getFullYear(),frm.vDal.getMonth(),frm.vDal.getDate() + g - 1);
	    var currPeriodo = giorno.getFullYear() * 1000 + giorno.getMonth() + 1;
	    if(arrPeriodi.indexOf(currPeriodo) == -1)
	       arrPeriodi.push(currPeriodo);
	}
		
	for(var i = 0; i < arrPeriodi.length; i++)
	{
		//TODO utilizzare altro metodo...
		var arrFestiviPeriodo = globals.getFestivitaDipendente(globals.getDitta(idlavoratore)
			                                                   ,idlavoratore
															   ,arrPeriodi[i]);
	    for(var fp = 0; fp < arrFestiviPeriodo.length; fp++)
	    {
	    	var anno = globals.getAnnoDaPeriodo(arrPeriodi[i]);
	    	var mese = globals.getMeseDaPeriodo(arrPeriodi[i]);
	    	frm.vArrFestivita.push(new Date(anno, mese - 1,arrFestiviPeriodo[fp]));
	    }
	}
	
	// aggiornamento commesse selezionabili
	var dsCommLav = globals.getFasiCommesseLavoratore(idlavoratore,frm.vDal,frm.vAl);
	/** @type {Array<Number>}*/
	var arrCommLav = dsCommLav.getColumnAsArray(1);
	frm.vArrCommesseFasi = arrCommLav;
//	frm.updateDitteCommesseFasi(arrCommLav);
	
	if(frm.validaSelezioneOpzioni())
	{
		globals.preparaInserimentoOreCommesseLavoratore(event
						                                ,idlavoratore
						                                ,arrCommLav//frm.vArrCommesseFasi
														,frm.vDal
														,frm.vAl
														,frm.vArrFestivita
														,true
														,null
														,frm.dxEvComm);
		globals.preparaInserimentoOreCommesseLavoratoreRiepilogo(event
													            ,idlavoratore
													            ,arrCommLav//frm.vArrCommesseFasi
																,frm.vDal
																,frm.vAl
																,frm.vArrFestivita
																,true
																,frm.dxEvComm);
	}
	frm.onActionAnnulla(event);
	
    forms.comm_ore_inserimento_tab.elements.btn_conferma_inserimento.enabled = false;
}
