/**
 * @properties={type:4,typeid:36,uuid:"F0F998FB-CECF-4B0E-8E64-F1CF9CA3D88A"}
 */
function esclusivo_ditta()
{
	if(ditte_commesse_esclusivo_ditta_to_ditte)
	   return 1;
	return 0;
}

/**
 * @properties={type:8,typeid:36,uuid:"0466380A-BC55-4CB9-B98D-CF335E34ACC0"}
 */
function totale_ore_lavorate_commessa()
{
	var totOre = 0;
	var fs = ditte_commesse_to_ditte_commesse_fasi;
	if(fs)
	{
		for(var i= 1; i <= fs.getSize(); i++)
			totOre += fs.getRecord(i).totale_ore_lavorate_fase;
	}
	return totOre;
}

/**
 * @properties={type:8,typeid:36,uuid:"255DAAC3-EF91-492A-8DA4-3186E9B69527"}
 */
function totale_ore_pianificate_commessa()
{
	var totOre = 0;
	var fs = ditte_commesse_to_ditte_commesse_fasi;
	if(fs)
	{
		for(var i= 1; i <= fs.getSize(); i++)
			totOre += fs.getRecord(i).totale_ore_pianificate_fase;
	}
	return totOre;
}
