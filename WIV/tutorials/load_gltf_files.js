import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
// import {
//     IFCWALL,
//     IFCWALLSTANDARDCASE,
//     IFCSLAB,
//     IFCWINDOW,
//     IFCMEMBER,
//     IFCPLATE,
//     IFCCURTAINWALL,
//     IFCDOOR,
// } from 'web-ifc';


const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
viewer.grid.setGrid();
viewer.axes.setAxes();

loadIfc('./IFC/01.ifc');

async function loadIfc(url) {
    // Load GLTF models saved in code below
    await viewer.GLTF.loadModel('./result/curtainwalls_Nivel 1.glb');
    await viewer.GLTF.loadModel('./result/slabs_Nivel 2.glb');
    await viewer.GLTF.loadModel('./result/slabs_Nivel 1.glb');
    await viewer.GLTF.loadModel('./result/doors_Nivel 1.glb');
    await viewer.GLTF.loadModel('./result/windows_Nivel 1.glb');
    await viewer.GLTF.loadModel('./result/walls_Nivel 1.glb');

    const rawProperties = await fetch('./result/properties.json');
    const properties = await rawProperties.json();

    

    // CODE FOR CREATING THE MODEL FILES (JSON + GLB)
    // const result = await viewer.GLTF.exportIfcFileAsGltf({
    //     ifcFileUrl: url,
    //     getProperties: true,
    //     splitByFloors: true,
    //     categories: {
    //         walls: [IFCWALL, IFCWALLSTANDARDCASE],
    //         slabs: [IFCSLAB],
    //         windows: [IFCWINDOW],
    //         curtainwalls: [IFCMEMBER, IFCPLATE, IFCCURTAINWALL],
    //         doors: [IFCDOOR],
    //     }
    // });
    // const link = document.createElement('a');
    // document.body.appendChild(link);
    // for(const categoryName in result.gltf) {
    //     const category = result.gltf[categoryName];
    //     for(const levelName in category) {
    //         const file = category[levelName].file;
    //         if(file) {
    //             link.download = `${categoryName}_${levelName}.glb`;
    //             link.href = URL.createObjectURL(file);
    //             link.click();
    //         }
    //     }
    // }
    // for (let jsonFile of result.json) {
    //     link.download = 'properties.json';
    //     link.href = URL.createObjectURL(jsonFile);
    //     link.click();
    // }
    // link.remove();
} 

