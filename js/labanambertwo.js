var container;
var loader = new THREE.TextureLoader();
var planets = [];
var planetName = [];
var planetInfo = [];
var satellites = [];
var clock = new THREE.Clock();
var camp, camx, camz;
var moonline = new THREE.Line();
var keyboard = new THREEx.KeyboardState();
var perscamera, persscene, renderer, orthocamera, orthoscene;

init();
onWindowResize();
animate();

function init()
{
    container = document.getElementById( 'container' );
    persscene = new THREE.Scene();
    perscamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000 );
    perscamera.position.set(100, 100, 0);
    perscamera.lookAt(new THREE.Vector3( 0, 0.0, 0));
    
    var width = window.innerWidth;
    var height = window.innerHeight;

    
    orthocamera = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, -height / 2, 1, 10 );
    orthocamera.position.z = 10; 
    orthoscene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff, 1);
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    camp = 0;
    camx = 0;
    camz = 0;

    var light = new THREE.AmbientLight( 0x252525 );
    persscene.add(light);
    var spotlight = new THREE.PointLight(0xffffff);
    spotlight.position.set(0, 0, 0);
    persscene.add(spotlight);

    renderer.autoClear = false;

    addStars();
    addPlanet(10, 0, 'pics/bob.jpg', 0.05, 0, 0.01, false, false);
    addPlanet(2, 20, 'pics/siega.jpg', 1, 1, 2, false, false);
    addPlanet(4, 40, 'pics/SiegaA.jpg', 0.9, 1, 1.8, false, false);
    addPlanet(5, 60, 'pics/putin.jpg', 0.7, 1, 1.4, false,false);
    addPlanet(5, 60, 'pics/earthmap1k.jpg', 0.7, 1, 1.8, true, false);
    addPlanet(6, 80, 'pics/rosh.jpg', 0.5, 1, 1, false, true);
    addPlanet(1, 10, 'pics/images.jpg', 0.7, 1, 1.4, false, false);

    createsprt('sprites/mercury.png');
    createsprt('sprites/venus.png');
    createsprt('sprites/earth.png');
    createsprt('sprites/mars.png');

    createinfosprt('sprites/Mercinf.png');
    createinfosprt('sprites/Venusinf.png');
    createinfosprt('sprites/Earthinfo.png');
    createinfosprt('sprites/Marsinfo.png');
}

function onWindowResize()
{
    perscamera.aspect = window.innerWidth / window.innerHeight;
    perscamera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// В этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate()
{
    requestAnimationFrame( animate );
    render();
    
    var delta = clock.getDelta();
    for (var i = 0; i < 6; i++)
    {
        if(i == 4)
        {
            //создание набора матриц
            var m = new THREE.Matrix4();
            var m1 = new THREE.Matrix4();
            var m2 = new THREE.Matrix4();
            planets[i].a1 += planets[i].v1 * delta;
            planets[i].a2 += planets[i].v2 * delta;
            //создание матрицы поворота (вокруг оси Y) в m1 и матрицы перемещения в m2
            m1.makeRotationY( planets[i].a1 );
            m2.setPosition(new THREE.Vector3(planets[i].posX, 0, 0));
            //запись результата перемножения m1 и m2 в m
            m.multiplyMatrices( m1, m2 );
            m1.makeRotationX(planets[i].a2);
            m.multiplyMatrices( m, m1 );
            //установка m в качестве матрицы преобразований объекта object        
            planets[i].sphere.matrix = m;
            planets[i].sphere.matrixAutoUpdate = false;
        }
        else
        {
            var m = new THREE.Matrix4();
            var m1 = new THREE.Matrix4();
            var m2 = new THREE.Matrix4();
            planets[i].a1 += planets[i].v1 * delta;
            planets[i].a2 += planets[i].v2 * delta;
            //создание матрицы поворота (вокруг оси Y) в m1 и матрицы перемещения в m2
            m1.makeRotationY( planets[i].a1 );
            m2.setPosition(new THREE.Vector3(planets[i].posX, 0, 0));
            //запись результата перемножения m1 и m2 в m
            m.multiplyMatrices( m1, m2 );
            m1.makeRotationY( planets[i].a2 );
            m.multiplyMatrices( m, m1 );
            //установка m в качестве матрицы преобразований объекта object        
            planets[i].sphere.matrix = m;
            planets[i].sphere.matrixAutoUpdate = false;
            if (i == 3)
            {
                var ma = new THREE.Matrix4();
                var ma1 = new THREE.Matrix4();
                var ma2 = new THREE.Matrix4();
                var ma3 = new THREE.Matrix4();
                var ma4 = new THREE.Matrix4();
                ma1.makeRotationY( planets[6].a1 );
                ma2.setPosition(new THREE.Vector3(planets[3].posX, 0, 0));
                ma3.makeRotationY( planets[6].a2);
                ma4.setPosition(new THREE.Vector3(planets[6].posX * Math.cos(-planets[6].a2), 0, planets[6].posX * Math.sin(-planets[6].a2)));
                ma.multiplyMatrices( ma1, ma2 );
                ma.multiplyMatrices( ma , ma3 );
                ma.multiplyMatrices( ma, ma4 );
                planets[6].sphere.matrix = ma;
                planets[6].sphere.matrixAutoUpdate = false;
                planets[6].a1 += planets[6].v1 * delta;
                planets[6].a2 += planets[6].v2 * delta;
                moonline.position.set(60 * Math.cos(-planets[6].a1), 0, 60 * Math.sin(-planets[6].a1));
            }
            if(camp > 0)
            {
            var cmat = new THREE.Matrix4();
            var cvec = new THREE.Vector3();
            cmat.copyPosition(planets[camp].sphere.matrix);
            cvec.setFromMatrixPosition(cmat);
            perscamera.position.set(cvec.x + 25 * Math.cos(camx - planets[camp].a1), 0 ,cvec.z+ 25 * Math.sin(camz - planets[camp].a1));
            perscamera.lookAt(cvec);
            }
            else
            {
                perscamera.position.set(100 * Math.cos(camx), 200 ,100 * Math.sin(camz));
                perscamera.lookAt(new THREE.Vector3( 0, 0.0, 0));
            }
            buttonclick();
        }
    }

    for(var i = 0; i < 4; i++)
    {
        
        if(i == 3)
        {
            planetName[i].position.set(planets[5].posX * Math.cos(-planets[5].a1), 10, planets[5].posX * Math.sin(-planets[5].a1));
        }
        else
        {
            planetName[i].position.set(planets[i + 1].posX * Math.cos(-planets[i + 1].a1), 10, planets[i + 1].posX * Math.sin(-planets[i + 1].a1));
        }
    }
}

function render()
{
    renderer.clear();
    renderer.render(persscene, perscamera);
    renderer.clearDepth();
    renderer.render(orthoscene, orthocamera);
}

function addStars()
{
    var geometry = new THREE.SphereGeometry( 500, 32, 32 );
    
    var tex = loader.load("pics/starmap.jpg");

    tex.minFilter = THREE.NearestFilter;
    var material = new THREE.MeshBasicMaterial
    ({
        map: tex,
        side: THREE.DoubleSide
    });

    var sphere = new THREE.Mesh( geometry, material );
    persscene.add( sphere );
}


function addPlanet(r, posX, tpic, v1, mesh, v2, havecloud, havebump)
{
    var geometry = new THREE.SphereGeometry( r, 32, 32 );
    var tex = loader.load( tpic );
    tex.minFilter = THREE.NearestFilter;
    if(havebump == true)
    {
        var bump = loader.load('pics/roshen.jpg');

         var material = new THREE.MeshPhongMaterial({
             map: tex,
            bumpMap: bump,
            bumpScale: 1,
            side: THREE.DoubleSide
            });
    } 
    else
    {
        if(mesh == 1 && havebump == false)
        {
        var material = new THREE.MeshPhongMaterial({
            map: tex,
            side: THREE.DoubleSide
        });
        }
        else 
        {   
            var material = new THREE.MeshBasicMaterial({
                map: tex,
                side: THREE.DoubleSide
            });
                
        };
    }

    if(planets.length < 6)
    {
        var planetline = new THREE.Geometry();
        var vertArray = planetline.vertices;
        for (var i = 0; i < 360; i++)
        {
            var x = posX * Math.cos(i*Math.PI/180);
            var z = posX * Math.sin(i*Math.PI/180);
        
            vertArray.push(new THREE.Vector3(x, 0, z));
        }
        var linematerial = new THREE.LineDashedMaterial( { color: 0x41EA49, dashSize: 3, gapSize: 1 } );
        var line = new THREE.Line( planetline, linematerial );
        line.computeLineDistances();
        persscene.add(line);
    }
    else
    {
        var planetline = new THREE.Geometry();
        var vertArray = planetline.vertices;
        for (var i = 0; i < 360; i++)
        {
            var x = 10 * Math.cos(i*Math.PI/180);
            var z = 10 * Math.sin(i*Math.PI/180);
        
            vertArray.push(new THREE.Vector3(x, 0, z));
        }
        var linematerial = new THREE.LineDashedMaterial( { color: 0x41EA49, dashSize: 3, gapSize: 1 } );
        moonline = new THREE.Line( planetline, linematerial );
        moonline.computeLineDistances();
        moonline.position.set(60,0,0);
        persscene.add(moonline);
    }
    if(havecloud == true)
    {
      var sphere = createEarthCloud();
    }
    else
    { 
    var sphere = new THREE.Mesh( geometry, material );

    }
    sphere.position.x = posX;
    persscene.add( sphere );
    var planet = {};
    planet.sphere = sphere;
    planet.posX = posX;
    planet.v1 = v1;
    planet.a1 = 0.0;
    planet.v2 = v2;
    planet.a2 = 0.0;
    planets.push(planet);
}

function buttonclick()
{
    if (keyboard.pressed("1")) 
    {
        camp = 0;
        camx = 0;
        camz = 0;
        for (var i = 0; i < planetName.length; i++)
        {
            planetName[i].visible = true;
            planetInfo[i].visible = false;
        } 
        
    }
    if(keyboard.pressed("2"))
    {
        camp = 1;
        camx = 0;
        camz = 0;
        for (var i = 0; i < planetName.length; i++)
        {
            planetName[i].visible = false;
            planetInfo[i].visible = false;
        } 
        planetInfo[0].visible = true;
        
    }
    if(keyboard.pressed("3"))
    {
        camp = 2;
        camx = 0;
        camz = 0;
        for (var i = 0; i < planetName.length; i++)
        {
            planetName[i].visible = false;
            planetInfo[i].visible = false;
        } 
        planetInfo[1].visible = true;
    }
    if(keyboard.pressed("4"))
    {
        camp = 3;
        camx = 0;
        camz = 0;
        for (var i = 0; i < planetName.length; i++)
        {
            planetName[i].visible = false;
            planetInfo[i].visible = false;
        } 
        planetInfo[2].visible = true;
    }
    if(keyboard.pressed("5"))
    {
        camp = 5;
        camx = 0;
        camz = 0;
        for (var i = 0; i < planetName.length; i++)
        {
            planetName[i].visible = false;
            planetInfo[i].visible = false;
        }
        planetInfo[3].visible = true;
    }
    if(keyboard.pressed("a"))
    {
        camx += 0.01;
        camz += 0.01;
    }
    if(keyboard.pressed("d"))
    {
        camx -= 0.01;
        camz -= 0.01;
    }

    
}

function createEarthCloud()
{
    var canvasResult = document.createElement('canvas');
    canvasResult.width = 1024;
    canvasResult.height = 512;
    var contextResult = canvasResult.getContext('2d');
    var imageMap = new Image();
    imageMap.addEventListener("load", function()
    {
        var canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        var contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
        var imageTrans = new Image();
        imageTrans.addEventListener("load", function()
        {
            var canvasTrans = document.createElement('canvas');
            canvasTrans.width = imageTrans.width;
            canvasTrans.height = imageTrans.height;
            var contextTrans = canvasTrans.getContext('2d');
            contextTrans.drawImage(imageTrans, 0, 0);
            var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width,
            canvasTrans.height);
            var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
            for(var y = 0, offset = 0; y < imageMap.height; y++)
            for(var x = 0; x < imageMap.width; x++, offset += 4)
            {
            dataResult.data[offset+0] = dataMap.data[offset+0];
            dataResult.data[offset+1] = dataMap.data[offset+1];
            dataResult.data[offset+2] = dataMap.data[offset+2];
            dataResult.data[offset+3] = 255-dataTrans.data[offset+0];
        }
        contextResult.putImageData(dataResult,0,0)
        material.map.needsUpdate = true;
    });

    imageTrans.src = 'pics/earthcloudmaptrans.jpg';
    }, false);

    imageMap.src = 'pics/earthcloudmap.jpg';
    
    var geometry = new THREE.SphereGeometry(5.1, 32, 32);
    var material = new THREE.MeshPhongMaterial({
    map: new THREE.Texture(canvasResult),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
    });

    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function createsprt(name)
{
    var texture = loader.load(name);
    var material = new THREE.SpriteMaterial( {map: texture} );

    var sprite = new THREE.Sprite( material );
    sprite.position.set( 20, 0, 0);
    sprite.scale.set(7, 7, 7);
    persscene.add( sprite );
    planetName.push( sprite );
}

function createinfosprt(name)
{
    var texture = loader.load(name);
    var material = new THREE.SpriteMaterial( {map: texture} );

    var sprite = new THREE.Sprite( material );
    sprite.center.set( 0.0, 1.0 );
    sprite.scale.set( 500,250, 10 );

    orthoscene.add(sprite);
    var width = window.innerWidth / 2;
    var height = window.innerHeight / 2;
    sprite.visible = false;
    sprite.position.set( -width, height, 1 );
    
    planetInfo.push( sprite );
}
