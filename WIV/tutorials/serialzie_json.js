import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
viewer.grid.setGrid();
viewer.axes.setAxes();

loadIfc('./IFC/01.ifc');

async function loadIfc(url) {
    const model = await viewer.IFC.loadIfcUrl(url);
    await viewer.shadowDropper.renderShadow(model.modelID);

    // serialize JSON to make it easier to work with the data
    const properties = await viewer.IFC.properties.serializeAllProperties(model);

    const file = new File(properties, 'properties.json');
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.download = 'properties.json';
    link.href = URL.createObjectURL(file);
    link.click();
    link.remove();
}

