import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import {
    IFCWALLSTANDARDCASE,
    IFCSLAB,
    IFCFURNISHINGELEMENT,
    IFCDOOR,
    IFCWINDOW,
    IFCPLATE,
    IFCMEMBER,
} from 'web-ifc';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
viewer.grid.setGrid();
viewer.axes.setAxes();

const scene = viewer.context.getScene();

let model;

async function loadIfc(url) {
    model = await viewer.IFC.loadIfcUrl(url);
    model.removeFromParent();
    togglePickable(model, false);

    await viewer.shadowDropper.renderShadow(model.modelID);
    // viewer.context.renderer.postProduction.active = true; 
    setupAllCategories();
}

loadIfc('IFC/01.ifc');

window.onmousemove = () => {
    viewer.IFC.selector.prePickIfcItem();
};

window.ondblclick = () => {
    const result = viewer.context.castRayIfc();
    console.log(result);
    if (result === null) return;

    const index = result.faceIndex;
    const subset = result.object;
    const id = viewer.IFC.loader.ifcManager.getExpressId(subset.geometry, index);
    viewer.IFC.loader.ifcManager.removeFromSubset(
        subset.modelID,
        [id],
        subset.userData.category
    );

    updatePostproduction();
}

const categories = {
    IFCWALLSTANDARDCASE,
    IFCSLAB,
    IFCFURNISHINGELEMENT,
    IFCDOOR,
    IFCWINDOW,
    IFCPLATE,
    IFCMEMBER
}

function getName(category) {
    const names = Object.keys(categories);
    return names.find(name => categories[name] === category);
}

async function getAll(category) {
    return viewer.IFC.loader.ifcManager.getAllItemsOfType(model.modelID, category);
}

async function newSubsetOfType(category) {
    const ids = await getAll(category);
    return viewer.IFC.loader.ifcManager.createSubset({
        modelID: model.modelID,
        scene,
        ids,
        removePrevious: true,
        customID: category.toString(),
    })
}

const subsets = {};

async function setupAllCategories() {
    const allCategories = Object.values(categories);
    for (const category of allCategories) {
        await setupCategory(category);
    }    
} 

async function setupCategory(category) {
    const subset = await newSubsetOfType(category);
    subset.userData.category = category.toString();
    subsets[category] = subset;
    togglePickable(subset, true);
    setupCheckbox(category);
}

function setupCheckbox(category) {
    const name = getName(category);
    const checkbox = document.getElementById(name);

    checkbox.addEventListener('change', (event) => {
        const checked = event.target.checked;
        const subset = subsets[category];
        if (checked) {
            scene.add(subset);
            togglePickable(subset, true);
        }
        else {
            subset.removeFromParent();
            togglePickable(subset, false);
        } 
        
        updatePostproduction();
    })
}


function togglePickable(mesh, isPickable) {
    const pickableModels = viewer.context.items.pickableIfcModels;
    if(isPickable) {
        pickableModels.push(mesh);
    } else {
        const index = pickableModels.indexOf(mesh);
        pickableModels.splice(index, 1);
    }
}

function updatePostproduction() {
    viewer.context.renderer.postProduction.update();
}