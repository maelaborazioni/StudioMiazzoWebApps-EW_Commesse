dataSource:"db:/ma_anagrafiche/ditte_commesse_fasi",
extendsID:"3C076162-6D45-4034-9F27-2ADA00E4841B",
items:[
{
labelFor:"fld_descrizione",
location:"90,5",
name:"lbl_descrizione",
size:"80,20",
text:"Descrizione",
transparent:true,
typeid:7,
uuid:"01CC488E-60ED-4115-9310-4A9AFC8A2A1F"
},
{
dataProviderID:"ditte_commesse_fasi_to_lavoratori.codice",
editable:false,
enabled:false,
formIndex:4,
location:"90,72",
name:"fld_codice",
size:"60,20",
toolTipText:"Codice della fase precedente",
typeid:4,
uuid:"0CC14E08-EA43-41AE-A384-A5EB1E21C42A"
},
{
dataProviderID:"bloccante",
displayType:4,
horizontalAlignment:0,
location:"410,117",
name:"fld_bloccante",
size:"60,20",
styleClass:"check",
toolTipText:"Se impostato, tutte le fasi che seguono questa fase non potranno essere compilate fino al termine della stessa",
transparent:true,
typeid:4,
uuid:"1A67561D-C050-40BB-A6AA-A1632D781242"
},
{
dataProviderID:"notefase",
location:"5,207",
name:"fld_note",
size:"515,40",
tabSeq:11,
typeid:4,
uuid:"1CD8AF0D-4E62-4DD2-8A96-5758F2CB61EE"
},
{
horizontalAlignment:0,
labelFor:"fld_concorre_in_presenze",
location:"240,97",
name:"lbl_concorre_in_presenze",
size:"80,20",
text:"Da autorizzare",
transparent:true,
typeid:7,
uuid:"2478FCE8-BF54-40EF-AABC-433E8FA1846C"
},
{
location:"470,255",
name:"btn_conferma",
onActionMethodID:"EE396CB7-FCCF-40C7-BB30-EB9D94CE0E6D",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_confirm_40",
tabSeq:12,
toolTipText:"Conferma dati della fase",
transparent:true,
typeid:7,
uuid:"2FF0A19D-BAB9-4386-8F2B-3775D8E4EE04"
},
{
dataProviderID:"finevaliditafase",
format:"dd/MM/yyyy|mask",
location:"90,117",
name:"fld_fine_validita",
size:"80,20",
tabSeq:5,
toolTipText:"Data di fine validità della fase",
typeid:4,
uuid:"322E1AFA-90EC-4718-B986-A79E66687E17"
},
{
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
null,\
\"'AG_Lkp_DitteCommesseFasi'\",\
\"'updateFasePrecedente'\",\
\"'filterFasePrecedente'\",\
null,\
null,\
null,\
\"true\"\
]\
}\
}",
enabled:false,
formIndex:5,
imageMediaID:"63989A2A-4430-42CD-B56B-58887766DBD3",
location:"90,162",
mediaOptions:14,
name:"btn_lk_fase",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_lookup",
transparent:true,
typeid:7,
uuid:"42D10B58-262E-4FD1-BABD-263AD0C55F10"
},
{
dataProviderID:"_codevento",
enabled:false,
location:"0,431",
name:"fld_codice_evento",
size:"65,20",
tabSeq:9,
typeid:4,
uuid:"48649312-0636-4471-971E-88EDEF3CEBD9",
visible:false
},
{
enabled:false,
imageMediaID:"63989A2A-4430-42CD-B56B-58887766DBD3",
location:"65,431",
name:"btn_lkp_evento",
showClick:false,
size:"20,20",
styleClass:"btn_lookup",
transparent:true,
typeid:7,
uuid:"4AFADE9F-598B-4CC1-AFE6-08ECAC117838",
visible:false
},
{
labelFor:"fld_terminata",
location:"5,52",
name:"lbl_terminata",
size:"60,20",
text:"Terminata",
transparent:true,
typeid:7,
uuid:"56A4AA50-F9D1-4993-B3AB-8627D8F07158"
},
{
location:"500,255",
name:"btn_annulla",
onActionMethodID:"F0CB8757-4ED8-4AD4-9BAA-47E3B7ACF283",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_cancel_40",
tabSeq:13,
toolTipText:"Annulla inserimento dati della fase",
transparent:true,
typeid:7,
uuid:"5757AE78-4203-4659-A09E-06C562264DA5"
},
{
formIndex:3,
location:"30,142",
name:"lbl_fase_precedente",
size:"175,20",
text:"Segue la fase",
transparent:true,
typeid:7,
uuid:"67068E6E-2998-4BB2-9FDF-96B1D8E8CE98"
},
{
formIndex:2,
labelFor:"fld_fine_validita",
location:"150,117",
name:"btn_calendar_al",
onActionMethodID:"763FDDFF-2CFE-46E2-A447-E7F60173BC57",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_calendar",
toolTipText:"Visualizza calendario per selezione data",
transparent:true,
typeid:7,
uuid:"78EAE776-11B8-438F-B921-4A2833A99F8E"
},
{
dataProviderID:"ditte_commesse_fasi_to_lavoratori.lavoratori_to_persone.nominativo",
editable:false,
enabled:false,
formIndex:6,
location:"170,72",
name:"fld_nominativo",
size:"350,20",
toolTipText:"Descrizione della fase precedente",
typeid:4,
uuid:"8BE293C5-D2CE-4D0D-9E74-649778192CFE"
},
{
labelFor:"fld_codice",
location:"5,5",
name:"lbl_fase",
size:"70,20",
text:"Fase",
transparent:true,
typeid:7,
uuid:"9821AC11-8663-49C6-A79C-2DF983056FC2"
},
{
dataProviderID:"codicefase",
location:"5,26",
name:"fld_fase",
size:"70,20",
tabSeq:1,
toolTipText:"Codice della fase",
typeid:4,
uuid:"98321A21-2669-4820-97A6-B1EE3007DEDA"
},
{
labelFor:"fld_inizio_validita",
location:"5,97",
name:"lbl_inizio_validita",
size:"80,20",
text:"Inizio validità",
transparent:true,
typeid:7,
uuid:"9F551CBC-F3EF-46C7-9B31-1C425F8664CC"
},
{
customProperties:"methods:{\
onActionMethodID:{\
arguments:[\
null,\
\"'terminatada'\",\
\"'AG_Lkp_Lavoratori'\",\
null,\
\"'filterLavoratoriTermineFase'\",\
null,\
null,\
null,\
\"true\"\
]\
}\
}",
enabled:false,
formIndex:5,
imageMediaID:"63989A2A-4430-42CD-B56B-58887766DBD3",
location:"150,72",
mediaOptions:14,
name:"btn_lkp_lavoratore",
onActionMethodID:"09683411-0331-4A08-BF5E-656611194522",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_lookup",
transparent:true,
typeid:7,
uuid:"A0227C75-7BF8-4CD1-8332-AB50DC03FAA3"
},
{
enabled:false,
labelFor:"fld_codice_evento",
location:"0,411",
name:"lbl_codice_evento",
size:"175,20",
text:"Evento generato in presenze",
transparent:true,
typeid:7,
uuid:"AB027410-DB41-452B-96C4-F1A80949878B",
visible:false
},
{
horizontalAlignment:0,
labelFor:"fld_fine_validita",
location:"90,97",
name:"lbl_fine_validita",
size:"80,20",
text:"Fine validità",
transparent:true,
typeid:7,
uuid:"B8526F72-2641-4A6F-8B2C-B6B8817D9243"
},
{
dataProviderID:"_codFasePrecedente",
editable:false,
formIndex:4,
location:"30,162",
name:"fld_cod_fase_prec",
size:"60,20",
toolTipText:"Codice della fase precedente",
typeid:4,
uuid:"B964FEC8-3C8A-452D-A59E-5F7C36BF09C2"
},
{
labelFor:"fld_note",
location:"5,187",
name:"lbl_note",
size:"80,20",
text:"Note",
transparent:true,
typeid:7,
uuid:"BDF15FA8-2E1D-4CBD-A088-B61A849ACB97"
},
{
dataProviderID:"vChkSegueFase",
displayType:4,
formIndex:8,
horizontalAlignment:0,
location:"5,162",
onDataChangeMethodID:"609071D6-AC1A-45AB-8B66-65452C7B7232",
size:"20,20",
styleClass:"check",
toolTipText:"Se impostato attiva la gestione della fase precedente",
transparent:true,
typeid:4,
uuid:"BE5CC28B-F6B4-4A91-A096-3852CFAE3C41"
},
{
labelFor:"fld_bloccante",
location:"410,97",
name:"lbl_bloccante",
size:"60,20",
text:"Bloccante",
transparent:true,
typeid:7,
uuid:"BE765C94-F174-4A4C-915C-A01DCEF909F2"
},
{
dataProviderID:"descrizionefase",
location:"90,25",
name:"fld_descrizione",
size:"430,20",
tabSeq:2,
toolTipText:"Descrizione della fase",
typeid:4,
uuid:"C163FE90-B2E0-4CD5-9165-D41202F1300C"
},
{
horizontalAlignment:0,
labelFor:"fld_monte_ore",
location:"175,97",
name:"lbl_monte_ore",
size:"60,20",
text:"Monte ore",
transparent:true,
typeid:7,
uuid:"C84F0C86-B18B-4D8F-B514-64B41C7CFD9A"
},
{
horizontalAlignment:0,
labelFor:"fld_concorre_in_fatturazione",
location:"325,97",
name:"lbl_concorre_in_fatturazione",
size:"80,20",
text:"Da fatturare",
transparent:true,
typeid:7,
uuid:"C8A35CF7-0896-49D8-83F8-B232A3D47E0F"
},
{
formIndex:2,
labelFor:"fld_inizio_validita",
location:"65,117",
name:"btn_calendar_dal",
onActionMethodID:"763FDDFF-2CFE-46E2-A447-E7F60173BC57",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_calendar",
toolTipText:"Visualizza calendario per selezione data",
transparent:true,
typeid:7,
uuid:"C99F2F36-76A4-450C-BA9E-D9CBF827804A"
},
{
dataProviderID:"dafatturare",
displayType:4,
horizontalAlignment:0,
location:"325,117",
name:"fld_concorre_in_fatturazione",
size:"80,20",
styleClass:"check",
tabSeq:8,
toolTipText:"Se impostato, le ore della fase devono essere fatturate ",
transparent:true,
typeid:4,
uuid:"CD7C561D-99B5-4E09-BB99-4017DA071CFB"
},
{
dataProviderID:"_descevento",
enabled:false,
location:"85,431",
name:"fld_descrizione_evento",
size:"430,20",
tabSeq:10,
typeid:4,
uuid:"CF4BC174-6D02-4DDB-9A9D-5CD37830F13E",
visible:false
},
{
dataProviderID:"monteorefase",
location:"175,117",
name:"fld_monte_ore",
size:"60,20",
tabSeq:6,
toolTipText:"Monte ore previsto per la fase",
typeid:4,
uuid:"D2AB9583-1B2A-4519-ABE9-9FDFD094045A"
},
{
labelFor:"fld_terminata",
location:"90,52",
name:"lbl_terminatac",
size:"115,20",
text:"Terminata da...",
transparent:true,
typeid:7,
uuid:"D2B2A172-4175-4FAF-9033-D1C7B3AC62BB"
},
{
dataProviderID:"iniziovaliditafase",
format:"dd/MM/yyyy|mask",
location:"5,117",
name:"fld_inizio_validita",
size:"80,20",
tabSeq:4,
toolTipText:"Data di inizio validità della fase",
typeid:4,
uuid:"D6E2251D-9636-4E93-A5FA-89B105E49D5C"
},
{
dataProviderID:"_descFasePrecedente",
formIndex:6,
location:"110,162",
name:"fld_desc_fase_prec",
size:"410,20",
toolTipText:"Descrizione della fase precedente",
typeid:4,
uuid:"D7A484C8-2B8E-4433-AE22-E29CCA1FDF0E"
},
{
dataProviderID:"terminata",
displayType:4,
horizontalAlignment:0,
location:"5,72",
name:"fld_terminata",
onDataChangeMethodID:"4F8C5528-9AFB-46A7-97DF-90F22624A37C",
size:"60,20",
styleClass:"check",
tabSeq:3,
toolTipText:"Imposta la fase come terminata",
transparent:true,
typeid:4,
uuid:"DABC9260-6B17-4F85-8D35-4AB73404B780"
},
{
extendsID:"AAAC08F8-0270-4E48-995F-E7066E036521",
height:290,
typeid:19,
uuid:"E74ADA35-759B-4BB3-923F-E260FFA5FF58"
},
{
dataProviderID:"daautorizzare",
displayType:4,
horizontalAlignment:0,
location:"240,117",
name:"fld_concorre_in_presenze",
size:"80,20",
styleClass:"check",
tabSeq:7,
toolTipText:"Se impostato, le ore della fase devono essere autorizzate alla fatturazione",
transparent:true,
typeid:4,
uuid:"F9270C6B-4785-42C4-BA04-59D09CBA8A9F"
}
],
name:"comm_gestione_commesse_fasi_dtl",
size:"535,245",
styleName:"leaf_style",
typeid:3,
uuid:"01E469D2-1DBF-4F91-AF43-E8DE0E817E7C"