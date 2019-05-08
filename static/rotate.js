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
        "y-z" : new THREE.Vector3(0, 1, 1).normalize(),
        "y+z" : new THREE.Vector3(0, 1, -1).normalize()
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

    //制御ビットのグループ
    const control_group = new THREE.Group();
    scene.add(control_group);

    //制御ビットの重ね合わせを表現するグループ
    const super_group = new THREE.Group();

    //ベクトル描画
    //標的ビットの軸
    const target_from = new THREE.Vector3(0, 0, 0);
    const length_xyz = 40;
    
    const to_x = new THREE.Vector3(0, 0, 1);
    const direction_x = to_x.clone().sub(target_from);
    const x_arrow = new THREE.ArrowHelper(direction_x.normalize(), target_from, length_xyz, 0x29b0da, 14, 14);
    scene.add(x_arrow);

    const to_y = new THREE.Vector3(1, 0, 0);
    const direction_y = to_y.clone().sub(target_from);
    const y_arrow = new THREE.ArrowHelper(direction_y.normalize(), target_from, length_xyz, 0xda2932, 14, 14);
    scene.add(y_arrow);

    const to_z = new THREE.Vector3(0, 1, 0);
    const direction_z = to_z.clone().sub(target_from);
    const z_arrow = new THREE.ArrowHelper(direction_z.normalize(), target_from, length_xyz, 0x9ceb43, 14, 14);
    scene.add(z_arrow);

    //制御ビットの軸
    const control_from = new THREE.Vector3(0, 240, 0);

    const control_to_x = new THREE.Vector3(0, 240, 120);
    const control_direction_x = control_to_x.clone().sub(control_from);
    const control_x_arrow = new THREE.ArrowHelper(control_direction_x.normalize(), control_from, length_xyz, 0x29b0da, 14, 14);
    control_group.add(control_x_arrow);

    const control_to_y = new THREE.Vector3(120, 240, 0);
    const control_direction_y = control_to_y.clone().sub(control_from);
    const control_y_arrow = new THREE.ArrowHelper(control_direction_y.normalize(), control_from, length_xyz, 0xda2932, 14, 14);
    control_group.add(control_y_arrow);

    const control_to_z = new THREE.Vector3(0, 360, 0);
    const control_direction_z = control_to_z.clone().sub(control_from);
    const control_z_arrow = new THREE.ArrowHelper(control_direction_z.normalize(), control_from, length_xyz, 0x9ceb43, 14, 14);
    control_group.add(control_z_arrow);

    //制御ビットの重ね合わせを表すブロッホ級の軸
    /*
    const super_from = new THREE.Vector3(0, 240, 0);

    const super_to_x = new THREE.Vector3(0, 240, 120);
    const super_direction_x = super_to_x.clone().sub(super_from);
    const super_x_arrow = new THREE.ArrowHelper(super_direction_x.normalize(), super_from, length_xyz, 0x29b0da, 14, 14);
    super_group.add(super_x_arrow);

    const super_to_y = new THREE.Vector3(120, 240, 0);
    const super_direction_y = super_to_y.clone().sub(super_from);
    const super_y_arrow = new THREE.ArrowHelper(super_direction_y.normalize(), super_from, length_xyz, 0xda2932, 14, 14);
    super_group.add(super_y_arrow);

    const super_to_z = new THREE.Vector3(0, 360, 0);
    const super_direction_z = super_to_z.clone().sub(super_from);
    const super_z_arrow = new THREE.ArrowHelper(super_direction_z.normalize(), super_from, length_xyz, 0x9ceb43, 14, 14);
    super_group.add(super_z_arrow);*/

    const super_x_arrow = new THREE.ArrowHelper(control_direction_x.normalize(), control_from, length_xyz, 0x29b0da, 14, 14);
    super_group.add(super_x_arrow);

    const super_y_arrow = new THREE.ArrowHelper(control_direction_y.normalize(), control_from, length_xyz, 0xda2932, 14, 14);
    super_group.add(super_y_arrow);

    const super_z_arrow = new THREE.ArrowHelper(control_direction_z.normalize(), control_from, length_xyz, 0x9ceb43, 14, 14);
    super_group.add(super_z_arrow);

    //制御ビットの状態ベクトル
    const to = new THREE.Vector3(0, 360, 0);
    const direction = to.clone().sub(control_from);
    const length = 120;
    const arrowHelper = new THREE.ArrowHelper(direction.normalize(), control_from, length, 0xDF013A, 15, 10);
    control_group.add(arrowHelper);

    //制御ビットの重ね合わせを表すブロッホ級の状態ベクトル
    const super_to = new THREE.Vector3(0, 120, 0);
    const super_direction = super_to.clone().sub(control_from);
    const super_arrowHelper = new THREE.ArrowHelper(super_direction.normalize(), control_from, length, 0xaa00cc, 15, 10);
    super_group.add(super_arrowHelper);

    //標的ビットの球を作成
    const sphere_geometry = new THREE.SphereGeometry(120, 30, 30);
    const target_material = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.4});
    const target_sphere = new THREE.Mesh(sphere_geometry, target_material);
    target_sphere.position.set(0, 0, 0);
    scene.add(target_sphere);

    //制御ビットの球を作成
    const control_material = new THREE.MeshLambertMaterial({color: 0x000000, transparent: true, opacity: 0.2});
    const control_sphere = new THREE.Mesh(sphere_geometry, control_material);
    control_sphere.position.set(0, 240, 0);
    control_group.add(control_sphere);

    //制御ビットの重ね合わせを表すブロッホ級の球を作成
    const super_sphere = new THREE.Mesh(sphere_geometry, control_material);
    super_sphere.position.set(0, 240, 0);
    super_group.add(super_sphere);

    //ワイヤフレーム描画
    const control_wire_geometry = new THREE.EdgesGeometry(control_sphere.geometry);
    const wire_material = new THREE.LineBasicMaterial({color: 0xBDBDBD,linewidth:2});
    const control_wireframe = new THREE.LineSegments(control_wire_geometry, wire_material);
    control_sphere.add(control_wireframe);

    const target_wire_geometry = new THREE.EdgesGeometry(target_sphere.geometry);
    const target_wireframe = new THREE.LineSegments(target_wire_geometry, wire_material);
    target_sphere.add(target_wireframe);

    const super_wire_geometry = new THREE.EdgesGeometry(super_sphere.geometry);
    const super_wireframe = new THREE.LineSegments(super_wire_geometry, wire_material);
    super_sphere.add(super_wireframe);
    
    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(30, 30, 30);
    scene.add(directionalLight);
    
    //レンダリング
    function tick() {
        renderer.render(scene, camera); 
        requestAnimationFrame(tick);
    }

    tick();
    
    var flag = 0;
    var quaternion = arrowHelper.quaternion;
    var target = new THREE.Quaternion();
    var control_state = "zero";
    
    /*
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
           if(control_state == "zero"){
               control_state = "one";
           }else if(control_state == "one"){
               control_state = "zero";
           }
       }
    }*/

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
        superposition();
        if(control_state == "zero"){
            control_state = "bell_plus";
        }else if(control_state == "one"){
            control_state = "bell_minus";
        }else if(control_state == "bell_plus"){
            control_state = "zero";
        }else if(control_state == "bell_minus"){
            control_state = "one";
        }
    }

    //はじめからボタン
    document.getElementById('start').onclick = function start(){
        location.reload();
    }

    function superposition(){
        scene.add(super_group);
        const purple_to = new THREE.Vector3(0, 360, 0);
        const purple_direction = purple_to.clone().sub(control_from);
        const purple_arrow = new THREE.ArrowHelper(purple_direction.normalize(), control_from, length, 0xaa00cc, 15, 10);
        control_group.add(purple_arrow);
    }

    var control_quaternion = control_group.quaternion;
    var control_target = new THREE.Quaternion();

    var super_quaternion = super_group.quaternion;
    var super_target = new THREE.Quaternion();

    function dispose_bec(){
        control_group.remove(arrowHelper);
    }

    //double_cx
    document.getElementById('cx').onclick = function double_cx(){
        if(control_state == "one"){
            //cxゲート
            /*
            (function cx(){
                if(flag < Math.PI){
                    control_target.setFromAxisAngle(Axis["z"], Math.PI/50);
                    control_target.multiply(control_quaternion.clone());  
                    control_quaternion.copy(control_target);  
                    flag += Math.PI/50;
                    requestAnimationFrame(cx);
                }else{
                    flag = 0;
                }
            })();*/
        }else if((control_state == "bell_plus")||(control_state == "bell_minus")){
            //chゲート
            (function ch(){
                dispose_bec()
                if(flag < Math.PI){
                    control_target.setFromAxisAngle(Axis["y-z"], Math.PI/50);
                    control_target.multiply(control_quaternion.clone());  
                    control_quaternion.copy(control_target);  
                    super_target.setFromAxisAngle(Axis["y+z"], Math.PI/50);
                    super_target.multiply(super_quaternion.clone());  
                    super_quaternion.copy(super_target);  
                    flag += Math.PI/50;
                    requestAnimationFrame(ch);
                }else{
                    flag = 0;
                }
            })();
        }else{
            alert("The State is Zero");
        }
    }
    
}