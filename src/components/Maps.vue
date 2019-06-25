<template>
  <div style="height: 100%; overflow: auto; position: unset;">
    <l-map
      id="l-map"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      ref="map"
      style="height: 100%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-control-layers position="topright"></l-control-layers>
      <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
        :token="token"
        layer-type="base"
      />
      <l-grid-layer :tile-component="tileComponent"></l-grid-layer>
      <!-- <l-marker :lat-lng="withPopup">
        <l-popup>
          <div @click="innerClick">
            I am a popup
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-popup>
      </l-marker>-->
      <!-- <l-marker :lat-lng="withTooltip">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div @click="innerClick">
            I am a tooltip
            <p v-show="showParagraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.
              Donec finibus semper metus id malesuada.
            </p>
          </div>
        </l-tooltip>
      </l-marker>-->
    </l-map>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import {
  LMap,
  LTileLayer,
  // LMarker,
  // LPopup,
  // LTooltip,
  LGridLayer
} from "vue2-leaflet";
import "leaflet-draw";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";

export default {
  name: "Maps",
  components: {
    LMap,
    LTileLayer,
    // LMarker,
    // LPopup,
    // LTooltip,
    LGridLayer
  },
  tileComponent: {
    name: "tile-component",
    props: {
      coords: {
        type: Object,
        required: true
      }
    },
    template: "<div>Coords: {{coords.x}}, {{coords.y}}, {{coords.z}}</div>"
  },
  data() {
    return {
      zoom: 13,
      center: latLng(52.5138587, 13.3187443),
      url:
        "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="subdomainshttp://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      withPopup: latLng(52.5138587, 13.3187443),
      withTooltip: latLng(52.5138587, 13.3187443),
      currentZoom: 11.5,
      currentCenter: latLng(52.5138587, 13.3187443),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      tileProviders: [
        {
          name: "OpenStreetMap",
          visible: true,
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        },
        {
          name: "OpenTopoMap",
          visible: false,
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution:
            'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        },
        {
          name: "Stamen Design",
          visible: false,
          url:
            "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png",
          attribution:
            '&copy; <a href="subdomainshttp://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        },
        {
          name: "Stamen Terrain",
          visible: false,
          url:
            "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
          attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: "abcd",
          minZoom: 0,
          maxZoom: 18
        },
        {
          name: "CartoDB_DarkMatter",
          visible: false,
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          minZoom: 0,
          maxZoom: 19
        },
        {
          name: "esri-satellite",
          visible: false,
          url:
            "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution:
            '&copy; <a href="http://www.esri.com/">Esri</a> i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18
        }
      ]
    };
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    }
  },
  mounted() {
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject;
      const drawControl = new L.Control.Draw({
        position: "topright",
        draw: {
          polyline: {
            allowIntersection: false,
            showArea: true
          },
          polygon: true,
          rectangle: true,
          circle: true,
          marker: true
        }
      });

      var drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      map.on("draw:created", function(e) {
        var type = e.layerType,
          layer = e.layer;

        if (type === "rectangle") {
          layer.on("mouseover", function() {
            alert(layer.getLatLngs());
          });
        }

        drawnItems.addLayer(layer);
      });

      map.addControl(drawControl);

      const editableLayers = new L.FeatureGroup().addTo(map);
      map.on(L.Draw.Event.CREATED, e => {
        // const type = e.layerType;
        const layer = e.layer;
        var type = e.layerType;

        if (type === "marker") {
          layer.bindPopup("LatLng: " + layer.getLatLng()).openPopup();
        }

        // if (type === "rectangle") {
        //   layer.bindPopup("LatLng: " + layer.getLatLng()).openPopup();
        // }
        

        // Do whatever else you need to. (save to db, add to map etc)
        editableLayers.addLayer(layer);
      });
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html,
body,
#maps {
  height: 100%;
  margin: 0;
}
body,
html {
  height: 100%;
}
#l-map {
  height: 100%;
}
</style>
