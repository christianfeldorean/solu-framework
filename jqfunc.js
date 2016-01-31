var loading=false;

if (window.jQuery) {  
    // jQuery is loaded  
   // alert("geladen");
} else {
    // jQuery is not loaded
  //  alert("nicht geladen");
}
jQuery.noConflict();

jQuery(document).ready(function($){
	$("body").on("click", ".solu",function(){
		$(this).imsactions();
		return false;
	});

}); 


jQuery.extend({
        unparam : function(params){
                var objResult = {};
                jQuery.each(params.split("&"), function(){ var prm=this.split("=");
                objResult[prm[0]] = prm[1]; });
                return objResult;
        }
        
});


jQuery.fn.disableTextSelect=function(){
    
	if (document.all) {
	    if (document.selection) document.selection.empty();
		//document.onselectstart =function () { return false; };
		return false;
	}

	$("body").css("-moz-user-select","none");
	$("body").attr("onselectstart","return false;");
	$("body").attr("unselectable","true");
	return false;
};

jQuery.fn.enableTextSelect=function(){
	return false;
};

jQuery.fn.discard = function(){
                        var garbageBin = document.getElementById('IELeakGarbageBin');
                        if (!garbageBin) {
                            garbageBin = document.createElement('DIV');
                            garbageBin.id = 'IELeakGarbageBin';
                           // garbageBin.style.display = 'none';
                            document.body.appendChild(garbageBin);
                        }
                  
                        this
                            .unbind() //unbind all handlers.
                            .each(function(){ // move the element to the garbage bin
								
                                garbageBin.appendChild(this);
                                garbageBin.innerHTML = '';
                            });
                         
                        
                        garbageBin = null;
};

function setcursor(mode){
            if(!mode){mode='default';}
            $("body .imswindow").css("cursor", mode);
            return false;
 }

jQuery.fn.imsactions=function(p){  // this is where the action was started
	ac = jQuery.extend({
		action: "",
		type: "POST",
		url: "index.php",
		datatype: "xml",
		async: true
		},p);
	var $ = jQuery;
	var actor=jQuery(this);   // clicked object

	var iwin=jQuery(this).parents(".imswindow:first");  //window where action was taken
	
	//var senddata={pmode: "ajax",windowid: $(iwin).attr("id")}; // Post data
	var senddata={};
	var action="";   // standard action
	var responset=""; // ajax response
	var winoptions=new Object();  // object for new window
	var ar={};
	var par={};
   if(jQuery(actor)[0]){
   switch(jQuery(actor)[0].tagName){
      case "A":
	      // window.alert('IMS Action - subtype A');
              var url=jQuery(this).attr("href").split("?");  //read url
              if(!url[1]) url[1]="";
              ar=$.unparam(url[1]);
	      // window.alert('URL: ' + url[0] + "\n" + 'QStr: ' + url[1]);
              if(ar['action']) ac.action=ar['action'];
              if(ar['pmode']) ac.pmode=ar['pmode'];
              ac.url=url[0];
              break;
      case "BUTTON":
              
              var nam=$(this).attr("name");
              ar[nam]=$(this).attr("value");
			 
			  ar[$(this).attr("class")]=1;
              $(this).find("var").each(function(){
                     var nam=$(this).attr("title");
                     ac[nam]=$(this).html();
              });
              if(jQuery(actor).parents("form:first").length==1){
              	var form=jQuery(actor).parents("form:first");
              	ac.url=$(form).attr("action");
              	$(form).find("input").each(function(){
				  var name=$(this).attr("name");
			 
				  if(par[name]){return;}
			 
				  /* TODO:Do that for radiobuttons
				  if($(this).attr("type")=="checkbox" && $(form).find("input[name="+$(this).attr("name")+"]").length>1){
					 alert($(this).attr("name"));
					  var postar=new Array();
					 $(form).find("input:checked[name="+name+"]").each(function(){
						postar.push($(this).val());
					 });
					 par[name]=postar;
					 senddata[name+"[]"]=postar;
				  }
				  */
				  if($(this).attr("type")=="checkbox"){
					  if($(this).is(':checked')){
						  var valcheck=$(this).val();
							if(!valcheck){valcheck='';}
							senddata[$(this).attr("name")]=valcheck;
					  }
				  }
				  else{
					var valcheck=$(this).val();
					if(!valcheck){valcheck='';}
					
					senddata[$(this).attr("name")]=valcheck;
				  }
          });
          	  } 
              break;
      case "INPUT":
              var nam=$(this).attr("name");
              ar[nam]=$(this).attr("value");
			  
              break;
      case "SELECT":
              var nam=$(this).attr("name");
              ar[nam]=$(this).val();
              break;
      case "LI":
          var nam=$(this).attr("name");
          ar[nam]=1;
          break;
	  case "TABLE":
              if(($(this).hasClass("makegrid") || $(this).hasClass("griddone")) && $(this).hasClass("userdef")){
				ar['loadgridcontent']=1;
			  }
              break;
   } 
   }
   if (ar) $.extend(senddata, ar);
    if(!ac.action || ac.action.lenght==0){
	if($(actor).hasClass("filtergrid")){
		ac.action="filtergrid";
	}
   }
   $.extend(senddata, ac);       
   
   switch(ac.action){
      case "filtergrid":
        var parts=$(actor).attr("class").split(" ");
      //  var grid=parts[parts.length-1];
	   var grid="";
		$.each(parts,function(num,val){
			if(val=='filtergrid'){
				grid=parts[num+1];
			}
		});
        ar['delsearchtext']=1;
		//ar['listtype']=grid;
		ar['refwindowid']=senddata['refwindowid'];
		//$.extend(senddata, ar);  
        var tab=$(actor).parents(".imswindow:first").find("table[class*='"+grid+" griddone']");
        $(tab).imsGridReload({adddata:ar,page:1});
     // return false;
      break;
    
       case "postform":  
          if($(actor).parents(".formsection:first").length==1){
              var form=$(actor).parents(".formsection:first");
              var sbutton=$(actor).attr("class");
          } else {
              var changes=$(".formsection:visible .changed", iwin);
              if($(changes).length==0) {return false;}
              //find submit button
              var sbutton=$(".formsection button:visible[name$=btn_save]", iwin);
             
              var form=$(changes).parents(".formsection:first");
              $(sbutton).find("var").each(function(){
                  var nam=$(this).attr("title");
                  senddata[nam]=$(this).html();
           });
          }
           
		  var par=new Array();
		  var i=0;
          $(form).find(".imssystem, .ppost, .changed, input:checked").each(function(){
			  var name=$(this).attr("name");
			
			  if(par[name]){return;}
			 
			  /* TODO:Do that for radiobuttons
			  if($(this).attr("type")=="checkbox" && $(form).find("input[name="+$(this).attr("name")+"]").length>1){
				 alert($(this).attr("name"));
				  var postar=new Array();
				 $(form).find("input:checked[name="+name+"]").each(function(){
					postar.push($(this).val());
				 });
				 par[name]=postar;
				 senddata[name+"[]"]=postar;
			  }
			  */
			  if($(this).attr("type")=="checkbox"){
				  if($(this).is(':checked')){
					  var valcheck=$(this).val();
						if(!valcheck){valcheck='';}
						senddata[$(this).attr("name")]=valcheck;
				  }
			  }
			  else{
			    var valcheck=$(this).val();
				if(!valcheck){valcheck='';}
				senddata[$(this).attr("name")]=valcheck;
			  }
          });   
		  

		  senddata[sbutton]=1;
	
		  if(windowinfo && windowinfo.mid){
          senddata['mid']=windowinfo.mid;
		  }
          $(".formsection",iwin).find(".changed").removeClass("changed");
        
          ac.action="genloading";var resp="";
		 break;
      
       default:  // general loading  
		ac.action="genloading";
   } // end switch
   
   if(ac.action=="genloading"){
	loading=true; 
	cursorwait();
	// window.alert('Default action genloading ...' + ac.url + ' / ' + ac.type);
	
	if(senddata['waitinfo']){
		$('#imswait').fadeIn("slow").html(senddata['waitinfo']);
		delete senddata['waitinfo'];
	}
	if(senddata['lockscreen']){
		$('#coverims').show();
		delete senddata['lockscreen'];
	}
	// senddata['refwindowid']=winoptions.refwindowid;
	ac['datatype']="xml";
	
	$.ajax({
		type: ac.type,
		url: ac.url,
		data: senddata,
		dataType: ac.datatype,
		async: ac.async,
		success: function(xml){
                                  if($("root > *",xml).length==0) return;
                                  var txt="";
                                  $("root > *",xml).each(function(){
                                      var acttag=$(this)[0].tagName;
                                      switch(acttag){
										  case "waitinfo": 
										  $("#imswait").show();
										  $('#imswait').html($(this).text());
										  break;
									      case "openimswindow":
										  var opts={}; var options=$(this).text();
										  $.each(options.split("|||"),function($num, $pair){
										     var data=$pair.split(":"); 
										     var name=data[0];
											 var val="";
											
											 if(data.length > 2){
												 for(var i=1;i<data.length;i++){
													if(val.length>0){val+=":";}
													val=val+data[i];
												 }
												
												 val = val.replace(/{/, "");val = val.replace(/}/, "");
												 var sval=new Object();

												 $.each(val.split(","),function($nums, $pairs){
													var datas=$pairs.split(":"); 
													var sname=datas[0];
													var subval=datas[1];
													sval[sname]=subval;
												 });
												 sval['refwindowid']=$(iwin).attr("id");
												 val=sval;
											 }
											 else{
											 var val=data[1];
											 }
											
											 opts[name]=val;
										  });
										  openimswindow(opts);
										  break;
										  case "closewindow":
                                          $.each($(this).attr("id").split(" "),function($num,$val){
                                          if($("#"+$val).length>0){  // find out if id exists for updates
                                            $("#"+$val).deletewindow("skipsavebclose");
                                          }
                                          });
                                          break;
                                          case "replaceContent":
						  txt=$(this).text();
						  $.each($(this).attr("id").split(" "),function($num,$val){
						  if($("#"+$val).length>0){  // find out if id exists for updates
							  jQuery("#"+$val)[0].innerHTML=txt;
							  jQuery("#"+$val).analysecontent();
						  }
						  });
                                          break;
										  case "removeContent":
										  $.each($(this).attr("id").split(" "),function($num,$val){
                                          if($("#"+$val).length>0){  
                                            $("#"+$val).discard();
                                          }
                                          });
										  break;
										  case "replaceContentsLike":
										  txt=$(this).text();
										  var idnam=$(this).attr("id");
										  if($("*[id*="+idnam+"]").length>0){
											$("*[id*="+idnam+"]")[0].innerHTML=txt;
										  }
                                          break;
										  case "appendContentOnce":
										  var checkid=$(this).attr("checkid");
                                          case "appendContent":
                                          txt=$(this).text();
                                          $.each($(this).attr("id").split(" "),function($num,$val){
                                          if($("#"+$val).length>0){  // find out if id exists for updates
										    if(acttag=="appendContentOnce" && $("#"+checkid).length>0) {return false;}
                                            jQuery("#"+$val)[0].innerHTML+=txt;
                                            jQuery("#"+$val).analysecontent();
                                          }
                                          });
                                          break;
                                          case "changeAttribute":
                                            var attr=$(this).attr("name"); // find attribute to be changed
                                            $("#"+$(this).attr("id")).attr(attr,$(this).text());
                                          break;
										  case "addAttribute":
                                            var attr=$(this).attr("name"); // find attribute to be changed
                                            $("#"+$(this).attr("id")).attr(attr,$(this).text());
                                          break;
										  case "removeAttribute":
                                            var attr=$(this).attr("name"); // find attribute to be changed
                                            $("#"+$(this).attr("id")).removeAttr(attr);
                                          break;
										  case "changeCSS":
											$("#"+$(this).attr("id")).css($(this).attr("name"),$(this).text());
										  break;
                                          case "message":
                                          var text=$(this).text(); 
                                          $(document.body).imswindow({loadcontent: false, windowcontent: text,windowtype:'dialog'});
                                          text=null;
                                          break;
                                          case "changeSettings":
                                          if($("#"+$(this).attr("id")).length>0){  // find out if id exists for updates
                                              $("#"+$(this).attr("id"))[0].innerHTML=$(this).text();
                                          }  
                                          break;
										  case "blockclose":
										  if($(this).text()=="true"){blockclose=true;}else{blockclose=false;}
										  break;
										  case "blockclosetxt":
										  blockclosetxt=$(this).text();
										  break;
                                          case "error":
                                          if($(this).attr("class")=="imserror1"){
											  blockclose=false;
                                              window.location = "./index.php?code=1";
                                          }   
										  
                                          break;
										  case "pRequestOnce":
										  var checkid=$(this).attr("id");
										  case "pRequest":
											if(acttag=="pRequestOnce" && intervals[checkid]) {return false;}
											//$("#imsprequests")[0].innerHTML+=$(this).text();
											var poptions = Object();var options=$(this).text();
											$.each(options.split("|||"),function($num, $pair){
										     var data=$pair.split(":"); 
										     var name=data[0];
											 var val=data[1];
											 poptions[name]=val;
											});
											poptions.intervalId=$(this).attr("id");
											if(!poptions.intervalId){return false;}
											if(!poptions.interval) poptions.interval=5000;
											intervals[poptions.intervalId]=setInterval(function callFunc() {$.fn.imsactions(poptions);},poptions.interval);
										  break;
										  case "stopInterval":
										    if(intervals && intervals[$(this).attr("id")]){
												clearInterval(intervals[$(this).attr("id")]);
												delete intervals[$(this).attr("id")];
											}
										  break;
										  case "script":
										    eval($(this).text());
											break;
										  case "returnfile":
											var oldblock=blockclose;
											blockclose=false;
											var fenster=window.open($(this).text(),"mywindow","width=300,height=200,scrollbars,left=0,top=0,resizable=yes");
										 	blockclose=oldblock;
										  break;
										  case "alert":
										  alert($(this).text());
										  break;
										  case "filterGrid":
											  var opts=new Object();
											  opts.page="1";
											  var clsnam=$(this).attr("id");
											  $("#"+clsnam).imsGridReload(opts);
											  $("table[class*="+clsnam+"]").imsGridReload(opts);
										  break;
										  case "wait":
											warten($(this).text());
										  break;
										  case "fadeoutafter":
											$("#"+$(this).attr("id")).show().delay($(this).text()).fadeOut("fast");
										  break;
										  case "openwindow":
												var oldblock=blockclose;
												blockclose=false;
												var fenster=window.open($(this).text(),"imswindow","width=300,height=200,scrollbars,left=0,top=0,resizable=yes");
											 	blockclose=oldblock;
											  break;
										  
                                      }});
                                       xml=null;txt=null;
                                      
                                       
                                },
                                complete: function(x){
                                    loading=false;
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown){
									//alert(textStatus+XMLHttpRequest+errorThrown);
								}           
          });
		 
         cursorwait();
		 
   }
   
	return false;
};

jQuery.fn.analysecontent=function(){ 
/*
			$('.imsupload',$(this)).imsfileupload(); 
            $('.imstabs',$(this)).imstabs();
			$('.adjustcols',$(this)).adjustcols();
            $('table[class*=makegrid]',$(this)).imsgrid();
            $('input[class*=date_'+aktlang+']',$(this)).mask("99.99.9999");
            if($(".tabmenulink",$(this)).length>0){
                $(this).parents(".applicationmenu:first").find(".taboptions").height(parseInt($(this).parents(".c:first").height()-$(this).height()));
                $(".tabmenulink",$(this)).applicationtabmenu();
            }
            $(':input:visible:enabled:first',$(this)).focus();
            */
			
return false;
};

function warten(prmSec)
  {
  prmSec *= 1000;
  var eDate = null;
  var eMsec = 0;
  var sDate = new Date();
  var sMsec = sDate.getTime();

  do {
      eDate = new Date();
      eMsec = eDate.getTime();

  } while ((eMsec-sMsec)<prmSec);
  return false;
}



function cursorwait(){
var $ = jQuery;
  if($("body").css("cursor")=="wait"){
      $("body").css("cursor","default");
  }
  else{
      $("body").css("cursor","wait");
  }
  return false;
}

function lockscreen(mode){
var $ = jQuery;
  if(mode=="off"){
      $("body .coverims").hide();
  }
  if(mode=="on"){
      $("body .coverims").show();
  }
  return false;
}
