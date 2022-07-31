import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Dexie } from 'dexie';
import {
    IFCWALL,
    IFCWALLSTANDARDCASE,
    IFCSLAB,
    IFCDOOR,
    IFCWINDOW,
    IFCPLATE,
    IFCCURTAINWALL,
    IFCMEMBER,
} from 'web-ifc';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ 
    container, 
    backgroundColor: new Color(0xffffff) 
});
viewer.grid.setGrid();
viewer.axes.setAxes();

// Get all buttons
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const removeButton = document.getElementById('remove-button');
const input = document.getElementById('file-input');

// Set up button logic
removeButton.onclick = () => removeDatabase();
loadButton.onclick = () => loadSavedModel();
saveButton.onclick = () => input.click();
input.onchange = () => preprocessAndSaveModel();


// Set up what buttons the user can click
unpdateButtons();

function unpdateButtons() {
    const modelsNames = localStorage.getItem('modelsNames');
    
    if (modelsNames) {
        loadButton.classList.remove('disabled');
        removeButton.classList.remove('disabled');
        saveButton.classList.add('disabled');
    } else {
        loadButton.classList.add('disabled');
        removeButton.classList.add('disabled');
        saveButton.classList.remove('disabled');
    }
}

// Create a database
const db = createOrOpenDatabase();

function createOrOpenDatabase() {
    const db = new Dexie('ModelDatabase');
    
    db.version(1).stores({
        bimModels: `
        name,
        id,
        category,
        level
        `
    });

    return db;
}


async function preprocessAndSaveModel() {
    const file = input.files[0];
    const url = URL.createObjectURL(file);

    // CODE FOR CREATING THE MODEL FILES (JSON + GLB)
    const result = await viewer.GLTF.exportIfcFileAsGltf({
        ifcFileUrl: url,
        splitByFloors: true,
        categories: {
            walls: [IFCWALL, IFCWALLSTANDARDCASE],
            slabs: [IFCSLAB],
            windows: [IFCWINDOW],
            curtainwalls: [IFCMEMBER, IFCPLATE, IFCCURTAINWALL],
            doors: [IFCDOOR],
        }
    });

    const models = [];

    for (const categoryName in result.gltf) {
        const category = result.gltf[categoryName]
        for (const levelName in category) {
            const file = category[levelName].file;
            if (file) {

                const data = await file.arrayBuffer();

                models.push({
                    name: result.id + categoryName + levelName,
                    id: result.id,
                    category: categoryName,
                    level: levelName,
                    file: data,
                })
            }
        }
    }

    await db.bimModels.bulkPut(models);

    const names = models.map(model => model.name);
    // console.log(names);
    const serializedNames = JSON.stringify(names)
    // console.log(serializedNames);
    localStorage.setItem('modelsNames', serializedNames);
    location.reload();
}

async function loadSavedModel() {
    const serializedNames = localStorage.getItem('modelsNames');
    const names = JSON.parse(serializedNames);

    for (const name of names){
        const savedModel = await db.bimModels.where('name').equals(name).toArray();
        const data = savedModel[0].file;
        const file = new File([data], 'example');
        const url = URL.createObjectURL(file);
        await viewer.GLTF.loadModel(url);
    }

    loadButton.classList.add('.disable');
}

function removeDatabase() {
    localStorage.removeItem('modelsNames');
    db.delete();
    location.reload();
}