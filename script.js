
function toggleTheme(){

const html=document.documentElement;

if(html.dataset.theme==="contrast"){

html.dataset.theme="";

}else{

html.dataset.theme="contrast";

}

}



function setLang(lang){

document.documentElement.lang=lang;

}



document.documentElement.lang="pl";
