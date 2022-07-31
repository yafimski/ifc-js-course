import { Color, LineBasicMaterial, MeshBasicMaterial } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import Drawing from 'dxf-writer';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
viewer.grid.setGrid();
viewer.axes.setAxes();

let model; 
let allPlans;

async function loadIfc(url) {
    model = await viewer.IFC.loadIfcUrl(url);
    await viewer.shadowDropper.renderShadow(model.modelID);
    await viewer.plans.computeAllPlanViews(model.modelID);

    // floor plan navigation
    
    const lineMaterial = new LineBasicMaterial({color: 'black'});
    const baseMaterial = new MeshBasicMaterial({
        //color: 'white' by default
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
    });
    
    viewer.edges.create('example-edges', model.modelID, lineMaterial, baseMaterial);

    const container = document.getElementById('button-container');
    allPlans = viewer.plans.getAll(model.modelID);

    for (const plan of allPlans) {
        const currentPlan = viewer.plans.planLists[model.modelID][plan];
        const button = document.createElement('button');
        container.appendChild(button);
        button.textContent = currentPlan.name;
        button.onclick = () => {
            viewer.plans.goTo(model.modelID, plan);
            viewer.edges.toggle('example-edges', true);
            togglePostproduction(false);
            toggleShadow(false);
        }
    }

    const button = document.createElement('button');
    container.appendChild(button);
    button.textContent = 'Exit floorplans';
    button.onclick = () => {
        viewer.plans.exitPlanView();
        viewer.edges.toggle('example-edges', false);
        togglePostproduction(true);
        toggleShadow(true);
    }


    // floor plan export

    const project = await viewer.IFC.getSpatialStructure(model.modelID);
    const storeys = project.children[0].children[0].children;
    for (const storey of storeys){
        for (const child of storey.children){
            if (child.children.length) {
                storey.children.push(...child.children);
            }
        }
    }

    viewer.dxf.initializeJSDXF(Drawing);

    for (const plan of allPlans) {
        const currentPlan = viewer.plans.planLists[model.modelID][plan];
        const button = document.createElement('button');
        container.appendChild(button);
        button.textContent = 'Export ' + currentPlan.name;
        button.onclick = () => {
            const storey = storeys.find(storey => storey.expressID === currentPlan.expressID);
            exportDXF(storey, currentPlan, model.modelID);
        }
    }

}

loadIfc('IFC/01.ifc');

function toggleShadow(activate) {
    const shadows = Object.values(viewer.shadowDropper.shadows);
    for (let shadow of shadows) {
        shadow.root.visible = activate;
    }
}

function togglePostproduction(activate) {
    viewer.context.renderer.postProduction.active = activate; 
}

const dummySubsetMaterial = new MeshBasicMaterial({visible: false});

async function exportDXF(storey, plan, modelID) {
    // create new drawing if it doesn't exist
    if (!viewer.dxf.drawings[plan.name]) {
        viewer.dxf.newDrawing(plan.name);
    }

    const ids = storey.children.map(item => item.expressID);
    if (!ids) return;

    const subset = viewer.IFC.loader.ifcManager.createSubset({
        modelID,
        ids,
        removePrevious: true,
        customID: 'floor_plan_generation',
        material: dummySubsetMaterial
    });

    const filteredPoints = [];
    const edges = await viewer.edgesProjector.projectEdges(subset);
    const positions = edges.geometry.attributes.position.array;

    const tolerance = 0.001;
    for (let i = 0; i < positions.length - 5; i += 6) {
        const a = positions[i] - positions[i + 3];
		// Z coords are multiplied by -1 to match DXF Y coordinate
		const b = -positions[i + 2] + positions[i + 5];

		const distance = Math.sqrt(a * a + b * b);
		if (distance > tolerance) {
			filteredPoints.push([positions[i], -positions[i + 2], positions[i + 3], -positions[i + 5]]);
		}
    }

    viewer.dxf.drawEdges(plan.name, filteredPoints, 'Projection', Drawing.ACI.BLUE, 'CONTINOUS');

    edges.geometry.dispose();

    viewer.dxf.drawNamedLayer(plan.name, plan, 'thick', 'Section', Drawing.ACI.RED, 'CONTINOUS');
    viewer.dxf.drawNamedLayer(plan.name, plan, 'thin', 'Section', Drawing.ACI.CYAN, 'CONTINOUS');

    const result = viewer.dxf.exportDXF(plan.name);
    const link = document.createElement('a');
    link.download = 'floorplan.dxf';
    link.href = URL.createObjectURL(result);
    document.body.appendChild(link);
    link.click();
    link.remove();
}