import Vue from 'vue'
import App from './App.vue'
import * as Vue2Leaflet from 'vue2-leaflet';
import { Icon } from 'leaflet'
import "leaflet/dist/leaflet.css"

Vue.component('l-map', Vue2Leaflet.LMap);
Vue.component('l-tile-layer', Vue2Leaflet.LTileLayer);
Vue.component('l-marker', Vue2Leaflet.LMarker);
Vue.component('l-control-layers', Vue2Leaflet.LControlLayers)
import "leaflet.icon.glyph";

delete Icon.Default.prototype._getIconUrl;
import L from 'leaflet';
delete Icon.Default.prototype._getIconUrl;


L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')
