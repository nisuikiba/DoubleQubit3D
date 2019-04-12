window.addEventListener('load', init);

function init() {

    //サイズを指定
    const width = 800;
    const height = 450;

    //回転の基準となるベクトルを作成
    var Axis = {  
        "x" : new THREE.Vector3(1, 0, 0).normalize(),
        "y" : new THREE.Vector3(0, 1, 0).normalize(),
        "z" : new THREE.Vector3(0, 0, 1).normalize(),
        "y-z" : new THREE.Vector3(0, 1, 1).normalize()
    };

    //レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);

    //シーンを作成
    const scene = new THREE.Scene();

    //カメラを作成
    const camera = new THREE.PerspectiveCamera(45, 800 / 450);
    camera.position.set(0, 0, +1000);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    const control_group = new THREE.Group();
    scene.add(control_group);

    //ベクトル描画
    //標的ビットの軸
    const from_x = new THREE.Vector3(0, 0, 0);
    const to_x = new THREE.Vector3(0, 0, 1);
    const direction_x = to_x.clone().sub(from_x);
    const length_x = 70;
    const x_arrow = new THREE.ArrowHelper(direction_x.normalize(), from_x, length_x, 0x29b0da, 14, 14);
    scene.add(x_arrow);
    //control_group.add(x_arrow);

    const from_y = new THREE.Vector3(0, 0, 0);
    const to_y = new THREE.Vector3(1, 0, 0);
    const direction_y = to_y.clone().sub(from_y);
    const length_y = 70;
    const y_arrow = new THREE.ArrowHelper(direction_y.normalize(), from_y, length_y, 0xda2932, 14, 14);
    scene.add(y_arrow);
    //control_group.add(y_arrow);

    const from_z = new THREE.Vector3(0, 0, 0);
    const to_z = new THREE.Vector3(0, 1, 0);
    const direction_z = to_z.clone().sub(from_z);
    const length_z = 70;
    const z_arrow = new THREE.ArrowHelper(direction_z.normalize(), from_z, length_z, 0x9ceb43, 14, 14);
    scene.add(z_arrow);
    //control_group.add(z_arrow);

    //制御ビットの軸
    const control_from_x = new THREE.Vector3(0, 240, 0);
    const control_to_x = new THREE.Vector3(0, 240, 120);
    const control_direction_x = control_to_x.clone().sub(control_from_x);
    const control_length_x = 70;
    const control_x_arrow = new THREE.ArrowHelper(control_direction_x.normalize(), control_from_x, control_length_x, 0x29b0da, 14, 14);
    control_group.add(control_x_arrow);

    const control_from_y = new THREE.Vector3(0, 240, 0);
    const control_to_y = new THREE.Vector3(120, 240, 0);
    const control_direction_y = control_to_y.clone().sub(control_from_y);
    const control_length_y = 70;
    const control_y_arrow = new THREE.ArrowHelper(control_direction_y.normalize(), control_from_y, control_length_y, 0xda2932, 14, 14);
    control_group.add(control_y_arrow);

    const control_from_z = new THREE.Vector3(0, 240, 0);
    const control_to_z = new THREE.Vector3(0, 360, 0);
    const control_direction_z = control_to_z.clone().sub(control_from_z);
    const control_length_z = 70;
    const control_z_arrow = new THREE.ArrowHelper(control_direction_z.normalize(), control_from_z, control_length_z, 0x9ceb43, 14, 14);
    control_group.add(control_z_arrow);

    const from = new THREE.Vector3(0, 240, 0);
    const to = new THREE.Vector3(0, 360, 0);
    const direction = to.clone().sub(from);
    const length = 120;
    const arrowHelper = new THREE.ArrowHelper(direction.normalize(), from, length, 0xDF013A, 15, 10);
    control_group.add(arrowHelper);

    //制御ビットの球を作成
    const control_geometry = new THREE.SphereGeometry(120, 30, 30);
    const control_material = new THREE.MeshLambertMaterial({color: 0x555555, transparent: true, opacity: 0.4});
    const control_sphere = new THREE.Mesh(control_geometry, control_material);
    control_sphere.position.set(0, 240, 0);
    control_group.add(control_sphere);

    //標的ビットの球を作成
    const target_geometry = new THREE.SphereGeometry(120, 30, 30);
    const target_material = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.4});
    const target_sphere = new THREE.Mesh(target_geometry, target_material);
    target_sphere.position.set(0, 0, 0);
    scene.add(target_sphere);

    //ワイヤフレーム描画
    const control_wire_geometry = new THREE.EdgesGeometry(control_sphere.geometry);
    const control_wire_material = new THREE.LineBasicMaterial({color: 0xBDBDBD,linewidth:2});
    const control_wireframe = new THREE.LineSegments(control_wire_geometry, control_wire_material);
    control_sphere.add(control_wireframe);

    const target_wire_geometry = new THREE.EdgesGeometry(target_sphere.geometry);
    const target_wire_material = new THREE.LineBasicMaterial({color: 0xBDBDBD,linewidth:2});
    const target_wireframe = new THREE.LineSegments(target_wire_geometry, target_wire_material);
    target_sphere.add(target_wireframe);
    
    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(20, 10, 30);
    scene.add(directionalLight);
    
    //レンダリング
    function tick() {
        //sphere.rotation.y += 0.002;
        //sphere_group.rotation.y += 0.002;
        renderer.render(scene, camera); 
        requestAnimationFrame(tick);
    }

    tick();
    
    var flag = 0;
    var quaternion = arrowHelper.quaternion;
    var target = new THREE.Quaternion();
    
    //xゲート
    document.getElementById('x').onclick = function xgate(){
       if(flag < Math.PI){
           target.setFromAxisAngle(Axis["z"], Math.PI/50);
           target.multiply(quaternion.clone());  
           quaternion.copy(target);  
           flag += Math.PI/50;
           requestAnimationFrame(xgate);
       }else{
           flag = 0;
       }
    }

    //zゲート
    document.getElementById('z').onclick = function zgate(){
        if(flag < Math.PI){
            target.setFromAxisAngle(Axis["y"], Math.PI/50);
            target.multiply(quaternion.clone());  
            quaternion.copy(target);  
            flag += Math.PI/50;
            requestAnimationFrame(zgate);
        }else{
            flag = 0;
        }
    }

    //hゲート
    document.getElementById('h').onclick = function hgate(){
        if(flag < Math.PI){
            target.setFromAxisAngle(Axis["y-z"], Math.PI/50);
            target.multiply(quaternion.clone());  
            quaternion.copy(target);  
            flag += Math.PI/50;
            requestAnimationFrame(hgate);
        }else{
            flag = 0;
        }
    }

    //sゲート
    document.getElementById('s').onclick = function sgate(){
        if(flag < Math.PI/2){
            target.setFromAxisAngle(Axis["y"], Math.PI/50);
            target.multiply(quaternion.clone());  
            quaternion.copy(target);  
            flag += Math.PI/50;
            requestAnimationFrame(sgate);
        }else{
            flag = 0;
        }
    }

    //tゲート
    document.getElementById('t').onclick = function tgate(){
        if(flag < Math.PI/4){
            target.setFromAxisAngle(Axis["y"], Math.PI/48);
            target.multiply(quaternion.clone());  
            quaternion.copy(target);  
            flag += Math.PI/48;
            requestAnimationFrame(tgate);
        }else{
            flag = 0;
        }
    }

    //はじめからボタン
    document.getElementById('start').onclick = function start(){
        location.reload();
    }

    var sphere_quaternion = control_group.quaternion;
    var sphere_target = new THREE.Quaternion();

    //cxゲート
    document.getElementById('cx').onclick = function cx(){
        if(flag < Math.PI){
            sphere_target.setFromAxisAngle(Axis["z"], Math.PI/50);
            sphere_target.multiply(sphere_quaternion.clone());  
            sphere_quaternion.copy(sphere_target);  
            flag += Math.PI/50;
            requestAnimationFrame(cx);
        }else{
            flag = 0;
        }
    }

    //czゲート
    document.getElementById('cz').onclick = function cz(){
        if(flag < Math.PI){
            sphere_target.setFromAxisAngle(Axis["y"], Math.PI/50);
            sphere_target.multiply(sphere_quaternion.clone());  
            sphere_quaternion.copy(sphere_target);  
            flag += Math.PI/50;
            requestAnimationFrame(cz);
        }else{
            flag = 0;
        }
    }

    //chゲート
    document.getElementById('ch').onclick = function ch(){
        if(flag < Math.PI){
            sphere_target.setFromAxisAngle(Axis["y-z"], Math.PI/50);
            sphere_target.multiply(sphere_quaternion.clone());  
            sphere_quaternion.copy(sphere_target);  
            flag += Math.PI/50;
            requestAnimationFrame(ch);
        }else{
            flag = 0;
        }
    }

    //csゲート
    document.getElementById('cs').onclick = function cs(){
        if(flag < Math.PI/2){
            sphere_target.setFromAxisAngle(Axis["y"], Math.PI/50);
            sphere_target.multiply(sphere_quaternion.clone());  
            sphere_quaternion.copy(sphere_target);  
            flag += Math.PI/50;
            requestAnimationFrame(cs);
        }else{
            flag = 0;
        }
    }

    //ctゲート
    document.getElementById('ct').onclick = function ct(){
        if(flag < Math.PI/4){
            sphere_target.setFromAxisAngle(Axis["y"], Math.PI/50);
            sphere_target.multiply(sphere_quaternion.clone());  
            sphere_quaternion.copy(sphere_target);  
            flag += Math.PI/50;
            requestAnimationFrame(ct);
        }else{
            flag = 0;
        }
    }
    
}