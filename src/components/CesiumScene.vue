
<template> 
    <div id="cesiumContainer"></div>
</template>
<script>
// import "cesium/Build/Cesium/Widgets/widgets.css";
export default {
  name: 'cesiumPage',
  data () {
    return {
    }
  },
  mounted(){
     this.ini();
     this.fireNew();
     this.add3dtitle();
    //  this.fire();
    //  this.fire();
    //  this.createParticleFire();
  },
  methods:{
    //初始化地图
    ini(){
        var that = this;
        var Cesium = this.Cesium;
        that.entitieBool=true;
        var cesiumContainer = document.getElementById("cesiumContainer");
        //天地图影像服务
        //   var tdtImagerLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
        //         url:"http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
        //         layer:"tiandituImg",
        //         style:"default",
        //         format:"image/jpeg",
        //         tileMatrixSetID:"tiandituImg",
        //         show:true,
        //         maximumLevel:18
        //     });

        //天地图注记服务
        var tdtNoteLayerProvider = new Cesium.WebMapTileServiceImageryProvider({
          url:
            "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=ebf64362215c081f8317203220f133eb",
          layer: "tiandituImgMarker",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "tiandituImgMarker",
          show: true,
          maximumLevel: 16
        });
        // 113.684891497 23.278482472 ,115.265440429 22.17811585 dd
        // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(113.684891497, 22.17811585, 115.265440429, 23.278482472);//西南东北，默认显示中国
        //加载天地图
        var viewer = new Cesium.Viewer("cesiumContainer", {
          animation: true, //是否显示动画控件
          baseLayerPicker: true, //是否显示图层选择控件
          geocoder: true, //是否显示地名查找控件
          timeline: true, //是否显示时间线控件
          sceneModePicker: true, //是否显示投影方式控件
          navigationHelpButton: false, //是否显示帮助信息控件
          infoBox: true, //是否显示点击要素之后显示的信息
          imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
            url:
              "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
            layer: "tdtBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
          })
        });
        that.viewer = viewer;
        //----------------------------------多图层控制
        var imageryLayers = viewer.imageryLayers;
        var tdtNoteLayer = imageryLayers.addImageryProvider(tdtNoteLayerProvider); //添加注记图层
        imageryLayers.raiseToTop(tdtNoteLayer); //将注记图层置顶
        imageryLayers.alpha = 0.3; //改变透明度
        imageryLayers.brightness = 1.5; //改变亮度
        // pitch是围绕X轴旋转，也叫做俯仰角，如图3所示。
        // yaw是围绕Y轴旋转，也叫偏航角，如图4所示。
        // roll是围绕Z轴旋转，也叫翻滚角，如图5所示。
        viewer.camera.setView({
          // fromDegrees()方法，将经纬度和高程转换为世界坐标
          destination: Cesium.Cartesian3.fromDegrees(119.597418, 34.557183, 7000.0),
          orientation: {
            // 指向
            heading: Cesium.Math.toRadians(0, 0),
            // 视角
            pitch: Cesium.Math.toRadians(-90),
            roll: 0.0
          }
        });
        //去除 版权图标
        viewer._cesiumWidget._creditContainer.style.display = "none";
        var scene = viewer.scene;  
       
        //场景点击事件
        var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(function(evt) {
          // let scene = viewer.scene;
          // let globe = scene.globe;
          // let ray = viewer.camera.getPickRay(evt.position);//position屏幕坐标 
          // let cartesian = globe.pick(ray, scene);
          // let ellipsoid = Cesium.Ellipsoid.WGS84;
          // let cartographic = ellipsoid.cartesianToCartographic(cartesian);
          // let height = cartographic.height;

          var ray = viewer.camera.getPickRay(evt.position);
          var cartesian = viewer.scene.globe.pick(ray, viewer.scene);

          var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          var lng = Cesium.Math.toDegrees(cartographic.longitude); //经度值
          var lat = Cesium.Math.toDegrees(cartographic.latitude); //纬度值
          console.log(lng,lat)
          var mapPosition={x:lng,y:lat,z:cartographic.height};//cartographic.height的值为地形高度。
          // var mapPosition = { x: 119.597418, y: 34.557183, z: cartographic.height }; //cartographic.height的值为地形高度。
          //触发回调右侧窗口
          that.$emit("mouserver", mapPosition);
          // changeData
          // var point=SrceenUtil.getMercator(mapPosition);
          // // var mapPosition={};
          // var minX=point.x-(802*5/2)
          // var maxX=point.x+(802*5/2)
          // var minY=point.y-(802*5/2)
          // var maxY=point.y+(802*5/2)
          // var min=SrceenUtil.getLngLat({x:minX,y:minY});
          // var max=SrceenUtil.getLngLat({x:maxX,y:maxY});
          // that.addImage(min.x,min.y,max.x,max.y);
          //         x: 12693778.421869352
          // y: 2586635.6243980383
          // console.log(point)
          // that.flyTo(lng,lat,2000);
          console.log(mapPosition);
          // that.createParticleFire();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    //加载3dtile模型
    add3dtitle() {
      var that = this;
      // http://121.35.9.106:8082/tileset.json
      //1加载倾斜摄影
      var Cesium = this.Cesium;
      that.cesium3Dtileset=new Cesium.Cesium3DTileset({
          url: "api/tileset.json" //  ./data/3dtiles-lab/tileset.json
        });
      var tileset = this.viewer.scene.primitives.add(
        that.cesium3Dtileset
      );

      tileset.readyPromise
        .then(function(tileset) {
          viewer.camera.viewBoundingSphere(
            boundingSphere,
            new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius)
          );
          viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        })
        .otherwise(function(error) {
          throw error;
        });
    },

    //火灾动画
    fire(){
        var that = this;
        var Cesium = this.Cesium;
        // var viewer = new Cesium.Viewer("cesiumContainer");

        var viewer=this.viewer;
       //Set the random number seed for consistent results.
        Cesium.Math.setRandomNumberSeed(3);

        //Set bounds of our simulation time
        var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
        var stop = Cesium.JulianDate.addSeconds(
          start,
          120,
          new Cesium.JulianDate()
        );

        //Make sure viewer is at the desired time.
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
        viewer.clock.multiplier = 1;
        viewer.clock.shouldAnimate = true;

        //Set timeline to simulation bounds
        viewer.timeline.zoomTo(start, stop);
        var viewModel = {
              emissionRate: 5.0,
              gravity: 0.0,
              minimumParticleLife: 1.2,
              maximumParticleLife: 1.2,
              minimumSpeed: 1.0,
              maximumSpeed: 4.0,
              startScale: 1.0,
              endScale: 5.0,
              particleSize: 25.0,
         };
         var entityPosition = new Cesium.Cartesian3();
          var entityOrientation = new Cesium.Quaternion();
          var rotationMatrix = new Cesium.Matrix3();
          var modelMatrix = new Cesium.Matrix4();

          function computeModelMatrix(entity, time) {
            return entity.computeModelMatrix(time, new Cesium.Matrix4());
          }

          var emitterModelMatrix = new Cesium.Matrix4();
          var translation = new Cesium.Cartesian3();
          var rotation = new Cesium.Quaternion();
          var hpr = new Cesium.HeadingPitchRoll();
          var trs = new Cesium.TranslationRotationScale();

          function computeEmitterModelMatrix() {
            hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
            trs.translation = Cesium.Cartesian3.fromElements(
              -4.0,
              0.0,
              1.4,
              translation
            );
            trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

            return Cesium.Matrix4.fromTranslationRotationScale(
              trs,
              emitterModelMatrix
            );
          }

          var pos1 = Cesium.Cartesian3.fromDegrees(
            119.597418, 34.557183
            // -75.15787310614596,
            // 39.97862668312678
          );
          var pos2 = Cesium.Cartesian3.fromDegrees(
            119.617418, 34.537183
            // -75.1633691390455,
            // 39.95355089912078
          );
          var position = new Cesium.SampledPositionProperty();

          position.addSample(start, pos1);
          position.addSample(stop, pos2);

          var entity = viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([
              new Cesium.TimeInterval({
                start: start,
                stop: stop,
              }),
            ]),
            model: {
              uri: "static/models/CesiumMilkTruck/CesiumMilkTruck.glb",
              minimumPixelSize: 64,
            },
            viewFrom: new Cesium.Cartesian3(-100.0, 0.0, 100.0),
            position: position,
            orientation: new Cesium.VelocityOrientationProperty(position),
          });
          viewer.trackedEntity = entity;

          var scene = viewer.scene;
          var particleSystem = scene.primitives.add(
            new Cesium.ParticleSystem({              
              image: "static/images/fire.png",
              startColor: Cesium.Color.LIGHTSEAGREEN.withAlpha(0.9),
              endColor: Cesium.Color.WHITE.withAlpha(0.3),

              startScale: viewModel.startScale,
              endScale: viewModel.endScale,

              minimumParticleLife: viewModel.minimumParticleLife,
              maximumParticleLife: viewModel.maximumParticleLife,

              minimumSpeed: viewModel.minimumSpeed,
              maximumSpeed: viewModel.maximumSpeed,

              imageSize: new Cesium.Cartesian2(
                viewModel.particleSize,
                viewModel.particleSize
              ),

              emissionRate: viewModel.emissionRate,

              bursts: [
                // these burst will occasionally sync to create a multicolored effect
                new Cesium.ParticleBurst({
                  time: 5.0,
                  minimum: 10,
                  maximum: 100,
                }),
                new Cesium.ParticleBurst({
                  time: 10.0,
                  minimum: 50,
                  maximum: 100,
                }),
                new Cesium.ParticleBurst({
                  time: 15.0,
                  minimum: 200,
                  maximum: 300,
                }),
              ],

              lifetime: 16.0,

              emitter: new Cesium.CircleEmitter(2.0),

              emitterModelMatrix: computeEmitterModelMatrix(),

              updateCallback: applyGravity,
            })
          );

          var gravityScratch = new Cesium.Cartesian3();

          function applyGravity(p, dt) {
            // We need to compute a local up vector for each particle in geocentric space.
            var position = p.position;

            Cesium.Cartesian3.normalize(position, gravityScratch);
            Cesium.Cartesian3.multiplyByScalar(
              gravityScratch,
              viewModel.gravity * dt,
              gravityScratch
            );

            p.velocity = Cesium.Cartesian3.add(
              p.velocity,
              gravityScratch,
              p.velocity
            );
          }

          viewer.scene.preUpdate.addEventListener(function (scene, time) {
            particleSystem.modelMatrix = computeModelMatrix(entity, time);

            // Account for any changes to the emitter model matrix.
            particleSystem.emitterModelMatrix = computeEmitterModelMatrix();

            // Spin the emitter if enabled.
            if (viewModel.spin) {
              viewModel.heading += 1.0;
              viewModel.pitch += 1.0;
              viewModel.roll += 1.0;
            }
          });

    },
    //火灾
    fireNew(){
        var that = this;
        var Cesium = this.Cesium;
        // var viewer = new Cesium.Viewer("cesiumContainer");
        var viewer=this.viewer;
        // var entity = viewer.entities.add({
        //       // 加载飞机模型
        //       model : {
        //           uri : 'static/models/CesiumAir/Cesium_Air.glb',
        //           minimumPixelSize : 64
        //       },
        //       position : Cesium.Cartesian3.fromDegrees(119.59773043727643,34.557087263073534, 30.0)
        //       });
        var entity = viewer.entities.add({
          name : 'Red box with black outline',
          position: Cesium.Cartesian3.fromDegrees(119.59773043727643,34.557087263073534, 0),
          box : {
            dimensions : new Cesium.Cartesian3(10.0, 10.0, 150.0),
            material : Cesium.Color.RED.withAlpha(0),
            outline : false,
            outlineColor : Cesium.Color.BLACK
          }
        });
          viewer.trackedEntity = entity;
          function computeModelMatrix(entity, time) {
            var position = Cesium.Property.getValueOrUndefined(entity.position, time, new Cesium.Cartesian3());
            if (!Cesium.defined(position)) {
                return undefined;
            }
            var orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, new Cesium.Quaternion());
            if (!Cesium.defined(orientation)) {
                var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, new Cesium.Matrix4());
            } else {
                modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, new Cesium.Matrix3()), position, new Cesium.Matrix4());
            }
            return modelMatrix;
        };
        //粒子系统
        var particleSystem = viewer.scene.primitives.add(new Cesium.ParticleSystem({
          image : "static/images/fire.png",
          startScale : 1.0,
          endScale : 4.0,
          particleLife : 1.0,
          speed : 5.0,
          imageSize : new Cesium.Cartesian2(100, 100),
          emissionRate : 30,
          //粒子发射器，box
          emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(0, 10.0, 180.0)),
          lifetime : 200,
          modelMatrix : computeModelMatrix(entity, Cesium.JulianDate.now()),
          emitterModelMatrix : computeEmitterModelMatrix()
      }));
        // var particleSystem = viewer.scene.primitives.add(new Cesium.ParticleSystem({
        //     // Particle appearance
        //     image : '"static/images/fire.png"',
        //     imageSize : new Cesium.Cartesian2(20, 20),
        //     startScale : 1.0,
        //     endScale : 4.0,
        //     // Particle behavior
        //     particleLife : 1.0,
        //     speed : 5.0,
        //     // Emitter parameters
        //     emitter : new Cesium.CircleEmitter(0.5),
        //     emissionRate : 5.0,
        //     emitterModelMatrix : computeModelMatrix(entity,Cesium.JulianDate.now()),
        //     // Particle system parameters
        //     modelMatrix : computeEmitterModelMatrix(),
        //     lifetime : 16.0
        // }));
          
        function computeEmitterModelMatrix() {
            var hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, new Cesium.HeadingPitchRoll());
            var trs = new Cesium.TranslationRotationScale();
            trs.translation = Cesium.Cartesian3.fromElements(2.5, 4.0, 1.0, new Cesium.Cartesian3());
            trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, new Cesium.Quaternion());
            return Cesium.Matrix4.fromTranslationRotationScale(trs, new Cesium.Matrix4());
        }
    }
  }

}
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>

