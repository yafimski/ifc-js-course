function randomPointCloud() {
    const cloudPoints = []
    const cloudSize = Math.floor(Math.random() * 7) + 3;
    for (let i = 0; i < cloudSize; i++)
    {
        const x = Math.floor(Math.random() * 5) + 1;
        const y = Math.floor(Math.random() * 5) + 1;
        const z = Math.floor(Math.random() * 5) + 1;
        cloudPoints.push({
            x: x,
            y: y,
            z: z,
        });
    }

    return cloudPoints;
}

function randomColorRGB() {
    const r = Math.floor(Math.random() * 255) + 1;
    const g = Math.floor(Math.random() * 255) + 1;
    const b = Math.floor(Math.random() * 255) + 1;
    
    return 'rgba(' + [r, g, b].join(',') + ',1)';
}

export const projects = [
    {
        name: 'Model 1',
        id: '1',
        geometryLocations: randomPointCloud(),
        color: randomColorRGB(),
    },
    {
        name: 'Model 2',
        id: '2',
        geometryLocations: randomPointCloud(),
        color: randomColorRGB(),
    },
    {
        name: 'Model 3',
        id: '3',
        geometryLocations: randomPointCloud(),
        color: randomColorRGB(),
    },
    {
        name: 'Model 4',
        id: '4',
        geometryLocations: randomPointCloud(),
        color: randomColorRGB(),
    },
    {
        name: 'Model 5',
        id: '5',
        geometryLocations: randomPointCloud(),
        color: randomColorRGB(),
    }
]