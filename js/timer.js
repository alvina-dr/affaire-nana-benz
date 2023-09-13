function date_heure(id)
{
        date = new Date;
        year = date.getFullYear();
        month = date.getMonth() + 1;
        j = date.getDate();


        h = date.getHours();
        if(h<10) h = "0"+h;
        m = date.getMinutes();
        if(m<10) m = "0"+m;
        s = date.getSeconds();
        if(s<10) s = "0"+s;
        
        if(month<10) month = "0"+month;
        
        resultat = ''+j+'/'+month+'/'+year+'  |  '+h+':'+m;
        document.getElementById(id).innerHTML = resultat;
        setTimeout('date_heure("'+id+'");','1000');
        return true;
}