// Leaflet.label - (c) 2012-2013, Jacob Toye, Smartrak - https://github.com/Leaflet/Leaflet.label
(function(t){var e=t.L;e.labelVersion="0.2.2-dev",e.Label=(e.Layer?e.Layer:e.Class).extend({includes:e.Mixin.Events,options:{className:"",clickable:!1,direction:"right",noHide:!1,offset:[12,-15],opacity:1,zoomAnimation:!0},initialize:function(t,i){e.setOptions(this,t),this._source=i,this._animated=e.Browser.any3d&&this.options.zoomAnimation,this._isOpen=!1},onAdd:function(t){this._map=t,this._pane=this.options.pane?t._panes[this.options.pane]:this._source instanceof e.Marker?t._panes.markerPane:t._panes.popupPane,this._container||this._initLayout(),this._pane.appendChild(this._container),this._initInteraction(),this._update(),this.setOpacity(this.options.opacity),t.on("moveend",this._onMoveEnd,this).on("viewreset",this._onViewReset,this),this._animated&&t.on("zoomanim",this._zoomAnimation,this),e.Browser.touch&&!this.options.noHide&&(e.DomEvent.on(this._container,"click",this.close,this),t.on("click",this.close,this))},onRemove:function(t){this._pane.removeChild(this._container),t.off({zoomanim:this._zoomAnimation,moveend:this._onMoveEnd,viewreset:this._onViewReset},this),this._removeInteraction(),this._map=null},setLatLng:function(t){return this._latlng=e.latLng(t),this._map&&this._updatePosition(),this},setContent:function(t){return this._previousContent=this._content,this._content=t,this._updateContent(),this},close:function(){var t=this._map;t&&(e.Browser.touch&&!this.options.noHide&&(e.DomEvent.off(this._container,"click",this.close),t.off("click",this.close,this)),t.removeLayer(this))},updateZIndex:function(t){this._zIndex=t,this._container&&this._zIndex&&(this._container.style.zIndex=t)},setOpacity:function(t){this.options.opacity=t,this._container&&e.DomUtil.setOpacity(this._container,t)},_initLayout:function(){this._container=e.DomUtil.create("div","leaflet-label "+this.options.className+" leaflet-zoom-animated"),this.updateZIndex(this._zIndex)},_update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updatePosition(),this._container.style.visibility="")},_updateContent:function(){this._content&&this._map&&this._prevContent!==this._content&&"string"==typeof this._content&&(this._container.innerHTML=this._content,this._prevContent=this._content,this._labelWidth=this._container.offsetWidth)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},_setPosition:function(t){var i=this._map,n=this._container,o=i.latLngToContainerPoint(i.getCenter()),s=i.layerPointToContainerPoint(t),a=this.options.direction,l=this._labelWidth,h=e.point(this.options.offset);"right"===a||"auto"===a&&s.x<o.x?(e.DomUtil.addClass(n,"leaflet-label-right"),e.DomUtil.removeClass(n,"leaflet-label-left"),t=t.add(h)):(e.DomUtil.addClass(n,"leaflet-label-left"),e.DomUtil.removeClass(n,"leaflet-label-right"),t=t.add(e.point(-h.x-l,h.y))),e.DomUtil.setPosition(n,t)},_zoomAnimation:function(t){var e=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPosition(e)},_onMoveEnd:function(){this._animated&&"auto"!==this.options.direction||this._updatePosition()},_onViewReset:function(t){t&&t.hard&&this._update()},_initInteraction:function(){if(this.options.clickable){var t=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.addClass(t,"leaflet-clickable"),e.DomEvent.on(t,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)e.DomEvent.on(t,i[n],this._fireMouseEvent,this)}},_removeInteraction:function(){if(this.options.clickable){var t=this._container,i=["dblclick","mousedown","mouseover","mouseout","contextmenu"];e.DomUtil.removeClass(t,"leaflet-clickable"),e.DomEvent.off(t,"click",this._onMouseClick,this);for(var n=0;i.length>n;n++)e.DomEvent.off(t,i[n],this._fireMouseEvent,this)}},_onMouseClick:function(t){this.hasEventListeners(t.type)&&e.DomEvent.stopPropagation(t),this.fire(t.type,{originalEvent:t})},_fireMouseEvent:function(t){this.fire(t.type,{originalEvent:t}),"contextmenu"===t.type&&this.hasEventListeners(t.type)&&e.DomEvent.preventDefault(t),"mousedown"!==t.type?e.DomEvent.stopPropagation(t):e.DomEvent.preventDefault(t)}}),e.BaseMarkerMethods={showLabel:function(){return this.label&&this._map&&(this.label.setLatLng(this._latlng),this._map.showLabel(this.label)),this},hideLabel:function(){return this.label&&this.label.close(),this},setLabelNoHide:function(t){this._labelNoHide!==t&&(this._labelNoHide=t,t?(this._removeLabelRevealHandlers(),this.showLabel()):(this._addLabelRevealHandlers(),this.hideLabel()))},bindLabel:function(t,i){var n=this.options.icon?this.options.icon.options.labelAnchor:this.options.labelAnchor,o=e.point(n)||e.point(0,0);return o=o.add(e.Label.prototype.options.offset),i&&i.offset&&(o=o.add(i.offset)),i=e.Util.extend({offset:o},i),this._labelNoHide=i.noHide,this.label||(this._labelNoHide||this._addLabelRevealHandlers(),this.on("remove",this.hideLabel,this).on("move",this._moveLabel,this).on("add",this._onMarkerAdd,this),this._hasLabelHandlers=!0),this.label=new e.Label(i,this).setContent(t),this},unbindLabel:function(){return this.label&&(this.hideLabel(),this.label=null,this._hasLabelHandlers&&(this._labelNoHide||this._removeLabelRevealHandlers(),this.off("remove",this.hideLabel,this).off("move",this._moveLabel,this).off("add",this._onMarkerAdd,this)),this._hasLabelHandlers=!1),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},getLabel:function(){return this.label},_onMarkerAdd:function(){this._labelNoHide&&this.showLabel()},_addLabelRevealHandlers:function(){this.on("mouseover",this.showLabel,this).on("mouseout",this.hideLabel,this),e.Browser.touch&&this.on("click",this.showLabel,this)},_removeLabelRevealHandlers:function(){this.off("mouseover",this.showLabel,this).off("mouseout",this.hideLabel,this),e.Browser.touch&&this.off("click",this.showLabel,this)},_moveLabel:function(t){this.label.setLatLng(t.latlng)}},e.Icon.Default.mergeOptions({labelAnchor:new e.Point(9,-20)}),e.Marker.mergeOptions({icon:new e.Icon.Default}),e.Marker.include(e.BaseMarkerMethods),e.Marker.include({_originalUpdateZIndex:e.Marker.prototype._updateZIndex,_updateZIndex:function(t){var e=this._zIndex+t;this._originalUpdateZIndex(t),this.label&&this.label.updateZIndex(e)},_originalSetOpacity:e.Marker.prototype.setOpacity,setOpacity:function(t,e){this.options.labelHasSemiTransparency=e,this._originalSetOpacity(t)},_originalUpdateOpacity:e.Marker.prototype._updateOpacity,_updateOpacity:function(){var t=0===this.options.opacity?0:1;this._originalUpdateOpacity(),this.label&&this.label.setOpacity(this.options.labelHasSemiTransparency?this.options.opacity:t)},_originalSetLatLng:e.Marker.prototype.setLatLng,setLatLng:function(t){return this.label&&!this._labelNoHide&&this.hideLabel(),this._originalSetLatLng(t)}}),e.CircleMarker.mergeOptions({labelAnchor:new e.Point(0,0)}),e.CircleMarker.include(e.BaseMarkerMethods),e.Path.include({bindLabel:function(t,i){return this.label&&this.label.options===i||(this.label=new e.Label(i,this)),this.label.setContent(t),this._showLabelAdded||(this.on("mouseover",this._showLabel,this).on("mousemove",this._moveLabel,this).on("mouseout remove",this._hideLabel,this),e.Browser.touch&&this.on("click",this._showLabel,this),this._showLabelAdded=!0),this},unbindLabel:function(){return this.label&&(this._hideLabel(),this.label=null,this._showLabelAdded=!1,this.off("mouseover",this._showLabel,this).off("mousemove",this._moveLabel,this).off("mouseout remove",this._hideLabel,this)),this},updateLabelContent:function(t){this.label&&this.label.setContent(t)},_showLabel:function(t){this.label.setLatLng(t.latlng),this._map.showLabel(this.label)},_moveLabel:function(t){this.label.setLatLng(t.latlng)},_hideLabel:function(){this.label.close()}}),e.Map.include({showLabel:function(t){return this.addLayer(t)}}),e.FeatureGroup.include({clearLayers:function(){return this.unbindLabel(),this.eachLayer(this.removeLayer,this),this},bindLabel:function(t,e){return this.invoke("bindLabel",t,e)},unbindLabel:function(){return this.invoke("unbindLabel")},updateLabelContent:function(t){this.invoke("updateLabelContent",t)}})})(window,document);
// Leaflet.fullscreen - Copyright (c) 2013, MapBox - https://github.com/Leaflet/Leaflet.fullscreen [edited]
L.Control.Fullscreen=L.Control.extend({options:{position:"topleft",title:{"false":"View Fullscreen","true":"Exit Fullscreen"}},onAdd:function(a){var b=L.DomUtil.create("div","leaflet-control-fullscreen leaflet-bar leaflet-control");this.link=L.DomUtil.create("a","leaflet-control-fullscreen-button leaflet-bar-part",b);this.link.href="#";this._map=a;this._map.on("fullscreenchange",this._toggleTitle,this);this._toggleTitle();L.DomEvent.on(this.link,"click",this._click,this);return b},_click:function(a){L.DomEvent.stopPropagation(a);
L.DomEvent.preventDefault(a);this._map.toggleFullscreen()},_toggleTitle:function(){this.link.title=this.options.title[this._map.isFullscreen()]}});
L.Map.include({isFullscreen:function(){return this._isFullscreen||!1},toggleFullscreen:function(){var a=document.body;this.isFullscreen()?document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitCancelFullScreen?document.webkitCancelFullScreen():document.msExitFullscreen?document.msExitFullscreen():(L.DomUtil.removeClass(a,"leaflet-pseudo-fullscreen"),this._setFullscreen(!1),this.invalidateSize(),this.fire("fullscreenchange")):a.requestFullscreen?
a.requestFullscreen():a.mozRequestFullScreen?a.mozRequestFullScreen():a.webkitRequestFullscreen?a.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT):a.msRequestFullscreen?a.msRequestFullscreen():(L.DomUtil.addClass(a,"leaflet-pseudo-fullscreen"),this._setFullscreen(!0),this.invalidateSize(),this.fire("fullscreenchange"))},_setFullscreen:function(a){this._isFullscreen=a;var b=document.body;a?L.DomUtil.addClass(b,"leaflet-fullscreen-on"):L.DomUtil.removeClass(b,"leaflet-fullscreen-on")},_onFullscreenChange:function(a){a=
document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement;a!==document.body||this._isFullscreen?a!==document.body&&this._isFullscreen&&(this._setFullscreen(!1),this.fire("fullscreenchange")):(this._setFullscreen(!0),this.fire("fullscreenchange"))}});L.Map.mergeOptions({fullscreenControl:!1});
L.Map.addInitHook(function(){this.options.fullscreenControl&&(this.fullscreenControl=new L.Control.Fullscreen,this.addControl(this.fullscreenControl));var a;"onfullscreenchange"in document?a="fullscreenchange":"onmozfullscreenchange"in document?a="mozfullscreenchange":"onwebkitfullscreenchange"in document?a="webkitfullscreenchange":"onmsfullscreenchange"in document&&(a="MSFullscreenChange");if(a){var b=L.bind(this._onFullscreenChange,this);this.whenReady(function(){L.DomEvent.on(document,a,b)});this.on("unload",
function(){L.DomEvent.off(document,a,b)})}});L.control.fullscreen=function(a){return new L.Control.Fullscreen(a)};
// Leaflet Control Search - Copyright (c) 2013 Stefano Cudini - https://github.com/stefanocudini/leaflet-search [edited]
(function(){L.Control.Search=L.Control.extend({includes:L.Mixin.Events,options:{wrapper:"",url:"",jsonpParam:null,layer:null,callData:null,propertyName:"title",propertyLoc:"loc",callTip:null,filterJSON:null,minLength:1,initial:!0,autoType:!0,delayType:400,tooltipLimit:-1,tipAutoSubmit:!0,autoResize:!0,collapsed:!0,autoCollapse:!1,autoCollapseTime:1200,zoom:null,text:"Search...",textCancel:"Cancel",textErr:"Location not found",position:"topleft",animateLocation:!0,circleLocation:!0,markerLocation:!1,
markerIcon:new L.Icon.Default},initialize:function(a){L.Util.setOptions(this,a||{});this._inputMinSize=this.options.text?this.options.text.length:10;this._layer=this.options.layer||new L.LayerGroup;this._filterJSON=this.options.filterJSON||this._defaultFilterJSON;this._autoTypeTmp=this.options.autoType;this._countertips=0;this._recordsCache={};this._curReq=null},onAdd:function(a){this._map=a;this._container=L.DomUtil.create("div","leaflet-control-search");this._input=this._createInput(this.options.text,
"search-input");this._tooltip=this._createTooltip("search-tooltip");this._cancel=this._createCancel(this.options.textCancel,"search-cancel");this._button=this._createButton(this.options.text,"search-button");this._alert=this._createAlert("search-alert");!1===this.options.collapsed&&this.expand(this.options.collapsed);if(this.options.circleLocation||this.options.markerLocation||this.options.markerIcon)this._markerLoc=new g([0,0],{showCircle:this.options.circleLocation,showMarker:this.options.markerLocation,
icon:this.options.markerIcon});this.setLayer(this._layer);a.on({resize:this._handleAutoresize,zoomstart:function(){this.collapse()},popupopen:function(){this.collapse()}},this);var b=this;$(document).on("click","*",function(a){"search-input"!=a.target.className&&b.collapse()});$("div#sidebar").on("mouseover",function(){b.collapse()});return this._container},addTo:function(a){this.options.wrapper?(this._container=this.onAdd(a),this._wrapper=L.DomUtil.get(this.options.wrapper),this._wrapper.style.position=
"relative",this._wrapper.appendChild(this._container)):L.Control.prototype.addTo.call(this,a);return this},onRemove:function(a){this._recordsCache={}},_getPath:function(a,b){var c=b.split("."),d=c.pop(),e=c.length,f=c[0],h=1;if(0<e)for(;(a=a[f])&&h<e;)f=c[h++];if(a)return a[d]},setLayer:function(a){this._layer=a;this._layer.addTo(this._map);this._markerLoc&&this._layer.addLayer(this._markerLoc);return this},showAlert:function(a){a=a||this.options.textErr;this._alert.style.display="block";this._alert.innerHTML=
a;clearTimeout(this.timerAlert);var b=this;this.timerAlert=setTimeout(function(){b.hideAlert()},this.options.autoCollapseTime);return this},hideAlert:function(){this._alert.style.display="none";return this},cancel:function(){this._input.value="";this._handleKeypress({keyCode:8});this._input.size=this._inputMinSize;this._input.focus();this._cancel.style.display="none";return this},expand:function(a){this._map.closePopup();a=a||!0;this._input.style.display="block";L.DomUtil.addClass(this._container,
"search-exp");0!=a&&(this._input.focus(),this._map.on("dragstart click",this.collapse,this));return this},collapse:function(){this._hideTooltip();this.cancel();this._alert.style.display="none";this._input.blur();this.options.collapsed&&(this._input.style.display="none",this._cancel.style.display="none",L.DomUtil.removeClass(this._container,"search-exp"),this._map.off("dragstart click",this.collapse,this));this.fire("search_collapsed");return this},collapseDelayed:function(){if(!this.options.autoCollapse)return this;
var a=this;clearTimeout(this.timerCollapse);this.timerCollapse=setTimeout(function(){a.collapse()},this.options.autoCollapseTime);return this},collapseDelayedStop:function(){clearTimeout(this.timerCollapse);return this},_createAlert:function(a){a=L.DomUtil.create("div",a,this._container);a.style.display="none";L.DomEvent.on(a,"click",L.DomEvent.stop,this).on(a,"click",this.hideAlert,this);return a},_createInput:function(a,b){var c=L.DomUtil.create("label",b,this._container),d=L.DomUtil.create("input",
b,this._container);d.type="text";d.size=this._inputMinSize;d.value="";d.autocomplete="off";d.autocorrect="off";d.autocapitalize="off";d.placeholder=a;d.style.display="none";d.role="search";d.id=d.role+d.type+d.size;c.htmlFor=d.id;c.style.display="none";c.value=a;L.DomEvent.disableClickPropagation(d).on(d,"keyup",this._handleKeypress,this).on(d,"keydown",this._handleAutoresize,this).on(d,"blur",this.collapseDelayed,this).on(d,"focus",this.collapseDelayedStop,this);return d},_createCancel:function(a,
b){var c=L.DomUtil.create("a",b,this._container);c.href="#";c.title=a;c.style.display="none";c.innerHTML="<span>&otimes;</span>";L.DomEvent.on(c,"click",L.DomEvent.stop,this).on(c,"click",this.cancel,this);return c},_createButton:function(a,b){var c=L.DomUtil.create("a",b,this._container);c.href="#";c.title=a;L.DomEvent.on(c,"click",L.DomEvent.stop,this).on(c,"click",this._handleSubmit,this).on(c,"focus",this.collapseDelayedStop,this).on(c,"blur",this.collapseDelayed,this);return c},_createTooltip:function(a){a=
L.DomUtil.create("div",a,this._container);a.style.display="none";var b=this;L.DomEvent.disableClickPropagation(a).on(a,"blur",this.collapseDelayed,this).on(a,"mousewheel",function(a){b.collapseDelayedStop();L.DomEvent.stopPropagation(a)},this).on(a,"mouseover",function(a){b.collapseDelayedStop();$(".search-tip-select").removeClass("search-tip-select");this._tooltip.currentSelection=0},this);return a},_createTip:function(a,b,c){if(this.options.callTip){if(b=this.options.callTip(a,b),"string"===typeof b){var d=
L.DomUtil.create("div");d.innerHTML=b;b=d.firstChild}}else b=L.DomUtil.create("a",""),b.href="#",b.setAttribute("data-key",c),b.innerHTML=a.replace(/^(.*?) - /,"<strong>$1</strong> - ");L.DomUtil.addClass(b,"search-tip");b._text=a;var e=this._input.value;L.DomEvent.disableClickPropagation(b).on(b,"click",L.DomEvent.stop,this).on(b,"click",function(a){this._handleAutoresize();this._input.focus();this.options.tipAutoSubmit&&this._handleSubmit(c);this._input.value=e},this);return b},_getUrl:function(){return"function"==
typeof this.options.url?this.options.url():this.options.url},_filterRecords:function(a){var b={};a=a.replace(RegExp("^[.]$|[[]|()*]","g"),"");a=new RegExp((this.options.initial?"^":"")+a,"i");for(var c in this._recordsCache)a.test(c)&&(b[c]=this._recordsCache[c]);return b},showTooltip:function(){var a,b;this._countertips=0;a=this.options.layer?this._filterRecords(this._input.value):this._recordsCache;this._tooltip.innerHTML="";this._tooltip.currentSelection=-1;for(var c in a){if(++this._countertips==
this.options.tooltipLimit)break;b=this._createTip(a[c].title,a[c],c);this._tooltip.appendChild(b)}0<this._countertips?(this._tooltip.style.display="block",this._autoTypeTmp&&this._autoType(),this._autoTypeTmp=this.options.autoType):this._hideTooltip();this._tooltip.scrollTop=0;return this._countertips},_hideTooltip:function(){this._tooltip.style.display="none";this._tooltip.innerHTML="";return 0},_defaultFilterJSON:function(a){var b={},c,d=this.options.propertyName,e=this.options.propertyLoc;if(L.Util.isArray(e))for(c in a)b[this._getPath(a[c],
d)]=L.latLng(a[c][e[0]],a[c][e[1]]);else for(c in a)b[this._getPath(a[c],d)]=L.latLng(this._getPath(a[c],e));return b},_recordsFromJsonp:function(a,b){var c=this;L.Control.Search.callJsonp=function(a){a=c._filterJSON(a);b(a)};var d=L.DomUtil.create("script","search-jsonp",document.getElementsByTagName("body")[0]),e=L.Util.template(this._getUrl()+"&"+this.options.jsonpParam+"=L.Control.Search.callJsonp",{s:a});d.type="text/javascript";d.src=e;return{abort:function(){d.parentNode.removeChild(d)}}},
_recordsFromAjax:function(a,b){void 0===window.XMLHttpRequest&&(window.XMLHttpRequest=function(){try{return new ActiveXObject("Microsoft.XMLHTTP.6.0")}catch(a){try{return new ActiveXObject("Microsoft.XMLHTTP.3.0")}catch(b){throw Error("XMLHttpRequest is not supported");}}});var c=new XMLHttpRequest,d=L.Util.template(this._getUrl(),{s:a}),e={};c.open("GET",d);var f=this;c.onreadystatechange=function(){if(4===c.readyState&&200===c.status){e=JSON.parse(c.responseText);var a=f._filterJSON(e);b(a)}};c.send();
return c},_recordsFromLayer:function(){var a=this,b={},c=this.options.propertyName,d;this._layer.eachLayer(function(e){e instanceof g||(e instanceof L.Marker||L.CircleMarker?a._getPath(e.options,c)?(d=e.getLatLng(),d.layer=e,b[a._getPath(e.options,c)]=d):a._getPath(e.feature.properties,c)?(d=e.getLatLng(),d.layer=e,b[a._getPath(e.feature.properties,c)]=d):console.log("propertyName '"+c+"' not found in marker",e):e.hasOwnProperty("feature")&&(e.feature.properties.hasOwnProperty(c)?(d=e.getBounds().getCenter(),
d.layer=e,b[e.feature.properties[c]]=d):console.log("propertyName '"+c+"' not found in feature",e)))},this);return b},_autoType:function(){var a=this._input.value.length,b=this._tooltip.firstChild._text,c=b.length;0===b.indexOf(this._input.value)&&(this._input.value=b,this._handleAutoresize(),this._input.createTextRange?(b=this._input.createTextRange(),b.collapse(!0),b.moveStart("character",a),b.moveEnd("character",c),b.select()):this._input.setSelectionRange?this._input.setSelectionRange(a,c):this._input.selectionStart&&
(this._input.selectionStart=a,this._input.selectionEnd=c))},_hideAutoType:function(){var a;if((a=this._input.selection)&&a.empty)a.empty();else if(this._input.createTextRange){a=this._input.createTextRange();a.collapse(!0);var b=this._input.value.length;a.moveStart("character",b);a.moveEnd("character",b);a.select()}else this._input.getSelection&&this._input.getSelection().removeAllRanges(),this._input.selectionStart=this._input.selectionEnd},_handleKeypress:function(a){switch(a.keyCode){case 27:this.collapse();
break;case 13:1==this._countertips&&this._handleArrowSelect(1);this._handleSubmit();break;case 38:this._handleArrowSelect(-1);break;case 40:this._handleArrowSelect(1);break;case 37:case 39:case 16:case 17:break;case 46:this._autoTypeTmp=!1;break;default:if(this._cancel.style.display=this._input.value.length?"block":"none",this._input.value.length>=this.options.minLength){var b=this;clearTimeout(this.timerKeypress);this.timerKeypress=setTimeout(function(){b._fillRecordsCache()},this.options.delayType)}else this._hideTooltip()}},
_fillRecordsCache:function(){var a=this._input.value,b=this;this._curReq&&this._curReq.abort&&this._curReq.abort();L.DomUtil.addClass(this._container,"search-load");this.options.callData?this._curReq=this.options.callData(a,function(a){b._recordsCache=b._filterJSON(a);b.showTooltip();L.DomUtil.removeClass(b._container,"search-load")}):this._getUrl()?this._curReq=this.options.jsonpParam?this._recordsFromJsonp(a,function(a){b._recordsCache=a;b.showTooltip();L.DomUtil.removeClass(b._container,"search-load")}):
this._recordsFromAjax(a,function(a){b._recordsCache=a;b.showTooltip();L.DomUtil.removeClass(b._container,"search-load")}):this.options.layer&&(this._recordsCache=this._recordsFromLayer(),this.showTooltip(),L.DomUtil.removeClass(this._container,"search-load"))},_handleAutoresize:function(){this._input.style.maxWidth!=this._map._container.offsetWidth&&(this._input.style.maxWidth=L.DomUtil.getStyle(this._map._container,"width"));this.options.autoResize&&this._container.offsetWidth+45<this._map._container.offsetWidth&&
(this._input.size=this._input.value.length<this._inputMinSize?this._inputMinSize:this._input.value.length)},_handleArrowSelect:function(a){var b=this._tooltip.hasChildNodes()?this._tooltip.childNodes:[];for(i=0;i<b.length;i++)L.DomUtil.removeClass(b[i],"search-tip-select");1==a&&this._tooltip.currentSelection>=b.length-1?L.DomUtil.addClass(b[this._tooltip.currentSelection],"search-tip-select"):-1==a&&0>=this._tooltip.currentSelection?this._tooltip.currentSelection=-1:"none"!=this._tooltip.style.display&&
(this._tooltip.currentSelection+=a,L.DomUtil.addClass(b[this._tooltip.currentSelection],"search-tip-select"),a=b[this._tooltip.currentSelection].offsetTop,a+b[this._tooltip.currentSelection].clientHeight>=this._tooltip.scrollTop+this._tooltip.clientHeight?this._tooltip.scrollTop=a-this._tooltip.clientHeight+b[this._tooltip.currentSelection].clientHeight:a<=this._tooltip.scrollTop&&(this._tooltip.scrollTop=a))},_handleSubmit:function(a){a=a||this._tooltip.currentSelection;this._hideAutoType();this.hideAlert();
"none"==this._input.style.display?this.expand():""===this._input.value?this.collapse():(a=this._getLocation(a),!1===a?this.showAlert():(this.showLocation(a,this._input.value),this.fire("search_locationfound",{latlng:a,text:this._input.value,layer:a.layer?a.layer:null})))},_getLocation:function(a){return this._recordsCache.hasOwnProperty(a)?this._recordsCache[a].loc:!1},showLocation:function(a,b){this.options.zoom?this._map.setView(a,this.options.zoom):this._map.panTo(a);this._markerLoc&&(this._markerLoc.setLatLng(a),
this._markerLoc.setTitle(b),this._markerLoc.show(),this.options.animateLocation&&this._markerLoc.animate());this.options.autoCollapse&&this.collapse();return this}});var g=L.Marker.extend({includes:L.Mixin.Events,options:{radius:10,weight:3,color:"#e03",stroke:!0,fill:!1,title:"",icon:new L.Icon.Default,showCircle:!0,showMarker:!1},initialize:function(a,b){L.setOptions(this,b);L.Marker.prototype.initialize.call(this,a,b);this.options.showCircle&&(this._circleLoc=new L.CircleMarker(a,this.options))},
onAdd:function(a){L.Marker.prototype.onAdd.call(this,a);this._circleLoc&&a.addLayer(this._circleLoc);this.hide()},onRemove:function(a){L.Marker.prototype.onRemove.call(this,a);this._circleLoc&&a.removeLayer(this._circleLoc)},setLatLng:function(a){L.Marker.prototype.setLatLng.call(this,a);this._circleLoc&&this._circleLoc.setLatLng(a);return this},setTitle:function(a){a=a||"";this.options.title=a;this._icon&&(this._icon.title=a);return this},show:function(){this.options.showMarker&&(this._icon&&(this._icon.style.display=
"block"),this._shadow&&(this._shadow.style.display="block"));this._circleLoc&&this._circleLoc.setStyle({fill:this.options.fill,stroke:this.options.stroke});return this},hide:function(){this._icon&&(this._icon.style.display="none");this._shadow&&(this._shadow.style.display="none");this._circleLoc&&this._circleLoc.setStyle({fill:!1,stroke:!1});return this},animate:function(){if(this._circleLoc){var a=this._circleLoc,b=parseInt(a._radius/10),c=this.options.radius,d=2.5*a._radius,e=0;a._timerAnimLoc=
setInterval(function(){e+=.5;b+=e;d-=b;a.setRadius(d);d<c&&(clearInterval(a._timerAnimLoc),a.setRadius(c))},200)}return this}});L.Map.addInitHook(function(){this.options.searchControl&&(this.searchControl=L.control.search(this.options.searchControl),this.addControl(this.searchControl))});L.control.search=function(a){return new L.Control.Search(a)}}).call(this);
// Leaflet Easy Button v1 - Copyright (c) 2014 Daniel Montague - https://github.com/CliffCloud/Leaflet.EasyButton
// Modified by mcarver - https://github.com/mcarver for witcher3map project to support title and id attributes
!function(){function t(t,s){this.title=t.title,this.stateName=t.stateName?t.stateName:"unnamed-state",this.icon=L.DomUtil.create("span",""),L.DomUtil.addClass(this.icon,"button-state state-"+this.stateName.trim()),this.icon.innerHTML=i(t.icon),this.onClick=L.Util.bind(t.onClick?t.onClick:function(){},s)}function i(t){var i;return t.match(/[&;=<>"']/)?i=t:(t=t.trim(),i=L.DomUtil.create("span",""),0===t.indexOf("fa-")?L.DomUtil.addClass(i,"fa "+t):0===t.indexOf("glyphicon-")?L.DomUtil.addClass(i,"glyphicon "+t):L.DomUtil.addClass(i,t),i=i.outerHTML),i}L.Control.EasyBar=L.Control.extend({options:{position:"topright",id:null,leafletClasses:!0},initialize:function(t,i){i&&L.Util.setOptions(this,i),this._buildContainer(),this._buttons=[];for(var s=0;s<t.length;s++)t[s]._bar=this,t[s]._container=t[s].button,this._buttons.push(t[s]),this.container.appendChild(t[s].button)},_buildContainer:function(){this._container=this.container=L.DomUtil.create("div",""),this.options.leafletClasses&&L.DomUtil.addClass(this.container,"leaflet-bar easy-button-container leaflet-control"),this.options.id&&(this.container.id=this.options.id)},enable:function(){return L.DomUtil.addClass(this.container,"enabled"),L.DomUtil.removeClass(this.container,"disabled"),this},disable:function(){return L.DomUtil.addClass(this.container,"disabled"),L.DomUtil.removeClass(this.container,"enabled"),this},onAdd:function(){return this.container},addTo:function(t){this._map=t;for(var i=0;i<this._buttons.length;i++)this._buttons[i]._map=t;var s=this._container=this.onAdd(t),e=this.getPosition(),n=t._controlCorners[e];return L.DomUtil.addClass(s,"leaflet-control"),-1!==e.indexOf("bottom")?n.insertBefore(s,n.firstChild):n.appendChild(s),this}}),L.easyBar=function(){for(var t=[L.Control.EasyBar],i=0;i<arguments.length;i++)t.push(arguments[i]);return new(Function.prototype.bind.apply(L.Control.EasyBar,t))},L.Control.EasyButton=L.Control.extend({options:{position:"topright",id:null,type:"replace",states:[],leafletClasses:!0},initialize:function(i,s,e,n){this.options.states=[],this.storage={},"object"==typeof arguments[arguments.length-1]&&L.Util.setOptions(this,arguments[arguments.length-1]),n&&(this.options.id=n),0===this.options.states.length&&"string"==typeof i&&"function"==typeof s&&this.options.states.push({icon:i,onClick:s,title:"string"==typeof e?e:""}),this._states=[];for(var o=0;o<this.options.states.length;o++)this._states.push(new t(this.options.states[o],this));this._buildButton(),this._activateState(this._states[0])},_buildButton:function(){if(this.button=L.DomUtil.create("button",""),this.options.id&&(this.button.id=this.options.id),this.options.title&&(this.button.title=this.options.title),this.options.leafletClasses&&L.DomUtil.addClass(this.button,"easy-button-button leaflet-bar-part"),L.DomEvent.addListener(this.button,"dblclick",L.DomEvent.stop),L.DomEvent.addListener(this.button,"click",function(t){L.DomEvent.stop(t),this._currentState.onClick(this,this._map?this._map:null),this._map.getContainer().focus()},this),"replace"==this.options.type)this.button.appendChild(this._currentState.icon);else for(var t=0;t<this._states.length;t++)this.button.appendChild(this._states[t].icon)},_currentState:{stateName:"unnamed",icon:function(){return document.createElement("span")}()},_states:null,state:function(t){return"string"==typeof t?this._activateStateNamed(t):"number"==typeof t&&this._activateState(this._states[t]),this},_activateStateNamed:function(t){for(var i=0;i<this._states.length;i++)this._states[i].stateName==t&&this._activateState(this._states[i])},_activateState:function(t){if(t!==this._currentState){"replace"==this.options.type&&(this.button.appendChild(t.icon),this.button.removeChild(this._currentState.icon)),t.title?this.button.title=t.title:this.button.removeAttribute("title");for(var i=0;i<this._states.length;i++)L.DomUtil.removeClass(this._states[i].icon,this._currentState.stateName+"-active"),L.DomUtil.addClass(this._states[i].icon,t.stateName+"-active");L.DomUtil.removeClass(this.button,this._currentState.stateName+"-active"),L.DomUtil.addClass(this.button,t.stateName+"-active"),this._currentState=t}},enable:function(){return L.DomUtil.addClass(this.button,"enabled"),L.DomUtil.removeClass(this.button,"disabled"),this},disable:function(){return L.DomUtil.addClass(this.button,"disabled"),L.DomUtil.removeClass(this.button,"enabled"),this},removeFrom:function(){return this._container.parentNode.removeChild(this._container),this._map=null,this},onAdd:function(){var t=L.easyBar([this],{position:this.options.position,leafletClasses:this.options.leafletClasses});return this._container=t.container,this._container}}),L.easyButton=function(){var t=Array.prototype.concat.apply([L.Control.EasyButton],arguments);return new(Function.prototype.bind.apply(L.Control.EasyButton,t))}}();
