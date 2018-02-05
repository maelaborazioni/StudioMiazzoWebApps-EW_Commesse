/**
 * @properties={type:8,typeid:36,uuid:"A26B52F0-6B13-4246-9FD7-13CAB346AB0B"}
 */
function totale_ore_lavorate_fase()
{
	var totOre = 0;
	var fs = ditte_commesse_fasi_to_commesse_giornaliera;
	if(fs)
	{
		for(var i = 1; i <= fs.getSize(); i++)
		    totOre += fs.getRecord(i).totale_ore_lavorate
	}
	return totOre;
}

/**
 * @properties={type:8,typeid:36,uuid:"DCA294BB-A265-4E12-9BB6-E517F53DA15A"}
 */
function totale_ore_pianificate_fase()
{
	var totOre = 0;
	var fs = ditte_commesse_fasi_to_commesse_giornaliera;
	if(fs)
	{
		for(var i = 1; i <= fs.getSize(); i++)
		    totOre += fs.getRecord(i).totale_ore_pianificate
	}
	return totOre;
}