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
      <l-control-layers position="topleft"></l-control-layers>
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
      <l-geo-json
        :geojson="geojson"
      >
      </l-geo-json>
    </l-map>
    <b-button id="slippy" @click="changeHashFunction('slippy')">Slippy</b-button>
    <b-button id="quad" @click="changeHashFunction('quadtree')">Quad</b-button>
    <!-- <b-button id="draw" @click="mapDraw">Draw</b-button> -->
    <b-button id="clear" @click="clearMap">Clear</b-button>
    <b-button id="geo" @click="showGeoJson">Show</b-button>
    <b-button id="hide" @click="hideGeoJson">Hide</b-button>
    <!-- Display tiles for copy in a modal -->
    <div id="modal">
      <b-button v-b-modal.modal-1>Copy</b-button>
      <b-modal id="modal-1" title="Copy tiles">
        <span class="my-4" v-for="item in labelarray1" v-bind:key="item">
          <span v-for="item1 in item" v-bind:key="item1">
            <li>{{ item1 }}</li>
          </span>
        </span>
      </b-modal>
    </div>
    <!-- <div id="card">
      <b-button type="button"
      v-clipboard:copy="message"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">Copy!</b-button>
    </div> -->

    <!-- TODO Copy to Clipboard
    <div></div>-->
    <b-card bg-variant="light" header="Tiles" class="text-center" id="card">
      <span class="my-4" v-for="item in labelarray1" v-bind:key="item">
          <span v-for="item1 in item" v-bind:key="item1">
            <li>{{ item1 }}</li>
          </span>
        </span>
    </b-card>
  </div>
</template>

<script>
import recJson from "./map.json";
import Vue from "vue";
import { latLng } from "leaflet";
import {
  LMap,
  LTileLayer,
  LGeoJson
  // LMarker,
  // LPopup,
  // LTooltip,
  // LGridLayer
} from "vue2-leaflet";
import "leaflet-draw";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
export default {
  name: "Maps",
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },

  data() {
    return {
      // drawFlag: false,
      // quadFlag: false,
      // slippyFlag: false,
      geojson: null,
      clicks: 0,
      hash: "",
      bounds: "",
      drawnItems: null,
      editableLayers: null,
      layerGroup: null,
      labelarray1: [],
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
    showGeoJson(){
      this.geojson = recJson;
    },
    hideGeoJson(){
      this.geojson = null;
    },
    onCopy: function (e) {
      alert('You just copied: ' + e.text)
    },
    onError: function (e) {
      alert('Failed to copy texts')
    },
    fillArray(long) {
      this.labelarray1.push(long);
    },
    clearMap() {
      // this.drawFlag = false;
      // this.quadFlag = false;
      // this.slippyFlag = false;

      const map = this.$refs.map.mapObject;
      // map.off();
      // map.remove();
      map.invalidateSize();
      if (this.layerGroup !== null) {
        map.removeLayer(this.layerGroup);
        // this.layerGroup.clearLayers();
      }
      if (this.drawnItems !== null) {
        map.removeLayer(this.drawnItems);
      }
      if (this.editableLayers !== null) {
        map.removeLayer(this.editableLayers);
      }
      // this.labelarray1.length = 0;
    },
    changeHashFunction(type) {
      const map = this.$refs.map.mapObject;
      // refresh map
      // map.off();+
      //
      map.invalidateSize();
      // this.layerGroup.clearLayers();
      if (this.layerGroup !== null) {
        map.removeLayer(this.layerGroup);
      }
      if (this.drawnItems !== null) {
        map.removeLayer(this.drawnItems);
      }
      if (this.editableLayers !== null) {
        map.removeLayer(this.editableLayers);
      }
      console.log("adaptertype", type);
      // if(type == "slippy"){
      //   this.slippyFlag = false;
      //   this.quadFlag = true;
      // }else if(type == "quadtree"){
      //   this.slippyFlag = true;
      //   this.quadFlag = false;
      // }
      // console.log("lalal", this.labelarray1);
      // this.labelarray1.length = 0;
      this.mapDraw(type);
    },
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
    },
    mapDraw(type) {
      // this.drawFlag = true;
      // this.quadFlag = false;
      // this.slippyFlag = true;
      // this.$nextTick(() => {
      const map = this.$refs.map.mapObject;
      var long = new Array();
      var self = this;
      var labelConfig = {
        noHide: true,
        className: "my-label",
        direction: "right",
        offset: [5, 50],
        zoomAnimation: true,
        permanent: true
      };

      var labelConfig2 = {
        noHide: true,
        className: "my-label2",
        direction: "right",
        offset: [-15, 25],
        zoomAnimation: true,
        permanent: true
      };

      var labelConfig3 = {
        noHide: true,
        className: "my-label2",
        direction: "right",
        offset: [-15, 25],
        zoomAnimation: true,
        permanent: false
      };

      var rectStyle = {
        color: "#ff0000",
        weight: 1,
        opacity: 0.3,
        fillOpacity: 0,
        lineCap: "butt"
      };

      var layerGroup = L.layerGroup();
      map.addLayer(layerGroup);

      var quadAdapter = {
        range: ["0", "1", "2", "3"],
        encode: function(centroid, precision) {
          var zoom = precision - 1;
          var tile = getTileXYZ(centroid.lat, centroid.lng, zoom);
          return SlippyToQuad(tile.x, tile.y, tile.z);
        },
        bbox: function(hash) {
          var tileSize = 256;
          var tile = QuadToSlippy(hash);

          // get NorthWest and SouthEast points
          var nwTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
          var seTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
          seTilePoint.x += tileSize;
          seTilePoint.y += tileSize;

          var nwLatLon = map.unproject(nwTilePoint, tile.z);
          var seLatLon = map.unproject(seTilePoint, tile.z);

          return {
            minlng: nwLatLon.lng,
            minlat: seLatLon.lat,
            maxlng: seLatLon.lng,
            maxlat: nwLatLon.lat
          };
        },
        layers: function(currentHash, zoom) {
          var layers = {};
          // if( zoom > 4 ) layers[ currentHash.substr( 0, zoom -4 ) ] = true;
          // if( zoom > 3 ) layers[ currentHash.substr( 0, zoom -3 ) ] = true;
          if (zoom > 2) layers[currentHash.substr(0, zoom - 2)] = true;
          if (zoom > 1) layers[currentHash.substr(0, zoom - 1)] = true;
          layers[currentHash.substr(0, zoom)] = true;
          return layers;
        },
        labels: function(hash) {
          return {
            long: hash,
            short: hash.substr(-1, 1)
          };
        }
      };

      var slippyAdapter = {
        range: quadAdapter.range,
        encode: quadAdapter.encode,
        bbox: quadAdapter.bbox,
        layers: quadAdapter.layers,
        labels: function(hash) {
          var tile = QuadToSlippy(hash);
          return {
            long: [tile.z, tile.x, tile.y].join("/"),
            short: ""
          };
        }
      };

      /** Converts numeric degrees to radians */
      if (typeof Number.prototype.toRad === "undefined") {
        Number.prototype.toRad = function() {
          return (this * Math.PI) / 180;
        };
      }

      function getTileXYZ(lat, lon, zoom) {
        var xtile = parseInt(Math.floor(((lon + 180) / 360) * (1 << zoom)));
        var ytile = parseInt(
          Math.floor(
            ((1 -
              Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) /
                Math.PI) /
              2) *
              (1 << zoom)
          )
        );
        return { x: xtile, y: ytile, z: zoom };
      }

      function QuadToSlippy(quad) {
        var x = 0;
        var y = 0;
        var z = 0;
        quad.split("").forEach(function(char) {
          x *= 2;
          y *= 2;
          z++;

          if (char == "1" || char == "3") {
            x++;
          }

          if (char == "2" || char == "3") {
            y++;
          }
        });
        return { x: x, y: y, z: z };
      }

      function SlippyToQuad(x, y, z) {
        var quadKey = [];
        for (var i = z; i > 0; i--) {
          var digit = "0";
          var mask = 1 << (i - 1);
          if ((x & mask) !== 0) {
            digit++;
          }
          if ((y & mask) !== 0) {
            digit++;
            digit++;
          }
          quadKey.push(digit);
        }
        return quadKey.join("");
      }

      var currentHash;
      var adapter = quadAdapter;
      // var adapter = hashAdapter;

      var mousePositionEvent = null;

      function generateCurrentHash(precision) {
        var center = map.getCenter();

        if (mousePositionEvent) {
          center = mousePositionEvent.latlng;
          // console.log( center );
        }

        return adapter.encode(center, precision);
      }
      // var type = "slippy";
      // var type = "";
      var prevHash = "NOTAHASH";

      //changehashfunction
      function changeHashFunction(algorithm) {
        // console.log("alg", algorithm);
        self.labelarray1.splice(0, self.labelarray1.length);
        // map.removeLayer(grayscale)
        if (algorithm == "slippy") {
          adapter = slippyAdapter;
        } else {
          adapter = quadAdapter;
        }
        prevHash = "NOTAHASH"; // force hash to regenerate

        // map.removeLayer(layerGroup);
        updateLayer();
        type = algorithm;
      }

      function updateLayer() {
        var zoom = map.getZoom();
        var hashLength = zoom + 1;

        // update current hash
        currentHash = generateCurrentHash(hashLength);

        // if (adapter === hashAdapter) {
        //   hashLength = zoomToHashChars(zoom);
        // }

        var hashPrefix = currentHash.substr(0, hashLength);

        // console.log( 'zoom', zoom );
        // console.log( 'prevHash', prevHash );
        // console.log( 'hashPrefix', hashPrefix );

        // performance tweak
        // @todo: not that performant?
        if (prevHash != hashPrefix) {
          // console.log( 'zoom', zoom );
          layerGroup.clearLayers();

          var layers = adapter.layers(currentHash, zoom);
          for (var attr in layers) {
            // console.log(attr);
            drawLayer(attr, layers[attr]);
          }
        }

        prevHash = hashPrefix;
      }

      //getLabels
      function getLabels() {
        var zoom = map.getZoom();
        var hashLength = zoom + 1;
        var labelarray = new Array();
        // update current hash
        currentHash = generateCurrentHash(hashLength);

        // if (adapter === hashAdapter) {
        //   hashLength = zoomToHashChars(zoom);
        // }

        var hashPrefix = currentHash.substr(0, hashLength);

        // console.log( 'zoom', zoom );
        console.log("prevHash", prevHash);
        console.log("hashPrefix", hashPrefix);

        // performance tweak
        // @todo: not that performant?
        if (prevHash == hashPrefix) {
          // console.log( 'zoom', zoom );
          layerGroup.clearLayers();

          var layers = adapter.layers(currentHash, zoom);
          console.log("*-*-", layers);
          for (var attr in layers) {
            // console.log(attr);
            var arr3 = getLayer(attr, layers[attr]);
            labelarray.push(arr3);
          }
        }
        // console.log("layers",layers);
        // console.log(labelarray);
        prevHash = hashPrefix;
        return labelarray;
      }

      //getLayer
      function getLayer(prefix, showDigit) {
        var arr1 = new Array();
        // console.log("prefix",prefix);
        adapter.range.forEach(function(n) {
          var hash = "" + prefix + n;
          var bbox = adapter.bbox(hash);

          var bounds = L.latLngBounds(
            L.latLng(bbox.maxlat, bbox.minlng),
            L.latLng(bbox.minlat, bbox.maxlng)
          );

          // console.log( hash );
          // console.log( bbox );

          // console.log( bounds );

          var arr2 = getRect(bounds, hash, showDigit);
          arr1.push(arr2);
        });
        console.log("array of lables", arr1);
        return arr1;
      }

      //drawRect
      function getRect(bounds, hash, showDigit) {
        // http://leafletjs.com/reference.html#path-options
        var poly = L.rectangle(bounds, rectStyle);
        // console.log("bounds",bounds);
        // poly.addTo(layerGroup);

        // generate labels
        var labels = adapter.labels(hash);

        // full (long) hash marker
        if (labels.long.length > 1) {
          var marker = new L.marker(poly.getBounds().getNorthWest(), {
            opacity: 0.0001
          });
          // console.log("labelslong", labels.long);
          marker.bindTooltip(labels.long, labelConfig);
          // marker.addTo(layerGroup);
        }

        if (type === "slippy") {
          if (showDigit) {
            var marker2 = new L.marker(poly.getBounds().getCenter(), {
              opacity: 0.0001
            });
            //console.log("marker2", marker2);

            marker2.bindTooltip(labels.short, labelConfig3);
            // console.log("#####",labels.long);
            // marker2.addTo(layerGroup);
          }
        } else {
          if (showDigit) {
            var marker3 = new L.marker(poly.getBounds().getCenter(), {
              opacity: 0.0001
            });
            // console.log("labelsshort", labels.short);
            marker3.bindTooltip(labels.short, labelConfig2);
            // marker3.addTo(layerGroup);
          }
        }
        return labels;
      }

      //draw rectangle
      function drawRect(bounds, hash, showDigit) {
        // http://leafletjs.com/reference.html#path-options
        var poly = L.rectangle(bounds, rectStyle);
        // console.log("bounds",bounds);
        poly.addTo(layerGroup);

        // generate labels
        var labels = adapter.labels(hash);
        //on click print labels.long

        // full (long) hash marker
        if (labels.long.length > 1) {
          var marker = new L.marker(poly.getBounds().getNorthWest(), {
            opacity: 0.0001
          });
          //console.log("marker", marker);
          marker.bindTooltip(labels.long, labelConfig);
          marker.addTo(layerGroup);
        }

        if (type === "slippy") {
          if (showDigit) {
            var marker2 = new L.marker(poly.getBounds().getCenter(), {
              opacity: 0.0001
            });
            //console.log("marker2", marker2);

            marker2.bindTooltip(labels.short, labelConfig3);
            // console.log("#####",labels.long);
            marker2.addTo(layerGroup);
          }
        } else {
          if (showDigit) {
            var marker3 = new L.marker(poly.getBounds().getCenter(), {
              opacity: 0.0001
            });
            // map.on("click", function(e){
            //   mousePositionEvent = e;
            //   console.log(e);
            // })
            marker3.bindTooltip(labels.short, labelConfig2);
            marker3.addTo(layerGroup);
          }
        }
      }

      //generate hash and bounds
      function drawLayer(prefix, showDigit) {
        adapter.range.forEach(function(n) {
          var hash = "" + prefix + n;
          var bbox = adapter.bbox(hash);

          var bounds = L.latLngBounds(
            L.latLng(bbox.maxlat, bbox.minlng),
            L.latLng(bbox.minlat, bbox.maxlng)
          );

          // console.log( hash );
          // console.log( bbox );

          // console.log( bounds );

          drawRect(bounds, hash, showDigit);
        });
      }

      // update on changes
      map.on("zoomend", updateLayer);
      map.on("moveend", updateLayer);

      // first call
      changeHashFunction(type);
      // updateLayer();

      map.on("mousemove", function(e) {
        mousePositionEvent = e;
        updateLayer();
      });
      var clicks;
      clicks = this.clicks;
      var labels = new Array();
      // todo onclick fill labelaray

      map.on("click", function(e) {
        labels.splice(0, labels.length);
        long.splice(0, long.length);
        // labelarray1.splice(0, this.labelarray1.length);
        labels = [];
        long = [];
        // this.labelarray1 = [];
        if (clicks == 0 && labels.length == 0 && long.length == 0) {
          // var zoom = map.getZoom();
          mousePositionEvent = e;
          var marker = e.latlng;
          labels = getLabels();
          console.log("labels", labels);

          labels[2].forEach(element => {
            long.push(element.long);
          });
          console.log("labels long", long);

          // console.log(this.labelarray1);
          // TODO make it a modal or copy to clipboard
          // alert(long);
          self.fillArray(long);
          // labels.length = 0;
          // long.length = 0;
          clicks = clicks + 1;
        }
        // L.marker(marker).addTo(map).bindPopup("label Array" + this.labelarray1).openPopup();
      });
      // this.fillArray(long);
      this.clicks = clicks;
      // });
      this.layerGroup = layerGroup;
    }
  },
  // init
  mounted() {
    const map = this.$refs.map.mapObject;
    map.invalidateSize();
    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polyline: {
          allowIntersection: false,
          showArea: true,
          measureControl: true
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

      if (type === "circle") {
        layer.on("click", function() {
          console.log("circle radius in mts", theRadius);
        });
        
        var theCenterPt = layer.getLatLng();
        var theRadius = layer.getRadius();
        var marker = theCenterPt;
        L.marker(marker)
          .addTo(drawnItems)
          .bindPopup(
            "centre: " +
              "<dd>" +
              marker +
              "</dd>" +
              " radius: " +
              theRadius.toFixed(2) +
              " mts"
          )
          .openPopup();
      }

      if (type === "rectangle") {
        layer.on("click", function() {
          var seeArea = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
          console.log("*-*",seeArea);
          layer.bindPopup("total area: " + seeArea.toFixed(2) + "sqmts").openPopup();    
          console.log(layer.getLatLngs());
          // var uu = L.LatLng.utm(kl);
          // console.log("utm", uu);
        });
      }

      if (type === "polygon") {
        layer.on("click", function() {
          var seeArea = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
          console.log("*-*",seeArea);
          layer.bindPopup("total area: " + seeArea.toFixed(2) + " sqmts").openPopup();
          console.log(layer.getLatLngs());
        });
      }

      if (type === "polyline") {
        //calculate distance between each points
        function getDistance() {
          var distanceArray = new Array();
          var distance = 0;
          var length = layer._latlngs.length;
          var marker0 = layer._latlngs[0];
          L.marker(marker0)
            .addTo(drawnItems)
            .bindTooltip("0 km");
          for (var i = 1; i < length; i++) {
            distance += layer._latlngs[i].distanceTo(layer._latlngs[i - 1]);
            var marker = layer._latlngs[i];
            console.log(marker);
            L.marker(marker)
              .addTo(drawnItems)
              .bindTooltip((distance / 1000).toFixed(2) + " km");
            distanceArray.push(distance);
            // layer._latlngs[i].bindTooltip(distance + " km").openPopup();
          }
          console.log(distanceArray);
          // optional

          return distance / 1000;
        }
        var distance = getDistance().toFixed(2);
        layer.bindTooltip("total distance: " + distance + " km");
        layer.on("mouseover", function() {
          // console.log(layer);
          // var latlng = layer.getLatLngs();
          // var from = latlng[0];
          // var to = latlng[1];
          // var distance = (from.distanceTo(to) / 1000).toFixed(2);
          // layer.bindTooltip("distance: " + distance + " km").openPopup();
          // var distance = layer.getDistance();
          // layer.bindTooltip("distance: "+ distance + "km").openPopup();
          layer.bindPopup("total distance: " + distance + " km").openPopup();
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
    this.drawnItems = drawnItems;
    this.editableLayers = editableLayers;
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
#slippy {
  position: absolute;
  top: 280px;
  right: 20px;
  padding: 10px;
  z-index: 500;
}
#quad {
  position: absolute;
  top: 330px;
  right: 20px;
  padding: 10px;
  z-index: 500;
}
#draw {
  position: absolute;
  top: 480px;
  right: 20px;
  padding: 10px;
  z-index: 500;
}
#clear {
  position: absolute;
  top: 530px;
  right: 20px;
  padding: 10px;
  z-index: 500;
}
#geo {
  position: absolute;
  top: 580px;
  right: 20px;
  padding: 10px;
  z-index: 500;
}
#hide {
  position: absolute;
  top: 630px;
  right: 20px;
  padding: 10px;
  z-index: 500;
}
#modal {
  position: absolute;
  top: 400px;
  right: 20px;
  z-index: 500;
}
.my-label {
  font-size: 10px;
  color: white;
  background-color: rgba(255, 0, 0, 0.5);
}

.my-label2 {
  font-size: 30px;
  color: rgba(255, 0, 0, 0.5);
  background-color: transparent;
}
#card {
  position: absolute;
  bottom: 100px;
  left: 10px;
  z-index: 500;
  padding: 10px;
}
</style>
