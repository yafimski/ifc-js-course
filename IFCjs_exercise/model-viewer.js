import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';


const currentUrl = window.location.href;
const url = new URL(currentUrl);
const currentProjectID = url.searchParams.get("id");

console.log(currentProjectID);


const container = document.getElementById('viewer-container');

const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
viewer.grid.setGrid();
viewer.axes.setAxes();

async function loadIfc(url) {
    const model = await viewer.IFC.loadIfcUrl(url);
    viewer.shadowDropper.renderShadow(model.modelID);
}

loadIfc('./static/IFC/0' + currentProjectID + '.ifc');
