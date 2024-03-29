const projects = [
    {
        name: 'Model 1',
        id: '1',
        url: './static/IFC/01.ifc'
    },
    {
        name: 'Model 2',
        id: '2',
        url: './static/IFC/02.ifc'
    },
    {
        name: 'Model 3',
        id: '3',
        url: './static/IFC/03.ifc'
    },
    {
        name: 'Model 4',
        id: '4',
        url: './static/IFC/04.ifc'
    },
    {
        name: 'Model 5',
        id: '5',
        url: './static/IFC/05.ifc'
    }
];

const projectContainer = document.getElementById("projects-container");
const baseURL = './model-viewer.html';

function createCard(project) {
    const card = document.createElement("div");
    card.classList.add("card");

    const logo = document.createElement("svg");
    logo.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    logo.setAttribute("width", "24");
    logo.setAttribute("height", "24");
    logo.setAttribute("viewBox", "0 0 24 24");

    const path = document.createElement("path");
    path.setAttribute("d", "M18 10.031v-6.423l-6.036-3.608-5.964 3.569v6.499l-6 3.224v7.216l6.136 3.492 5.864-3.393 5.864 3.393 6.136-3.492v-7.177l-6-3.3zm-1.143.036l-4.321 2.384v-4.956l4.321-2.539v5.111zm-4.895-8.71l4.272 2.596-4.268 2.509-4.176-2.554 4.172-2.551zm-10.172 12.274l4.778-2.53 4.237 2.417-4.668 2.667-4.347-2.554zm4.917 3.587l4.722-2.697v5.056l-4.722 2.757v-5.116zm6.512-3.746l4.247-2.39 4.769 2.594-4.367 2.509-4.649-2.713zm9.638 6.323l-4.421 2.539v-5.116l4.421-2.538v5.115z");

    logo.appendChild(path);
    card.appendChild(logo);

    const title = document.createElement("h2");
    title.textContent = project.name;
    card.appendChild(title);

    const button = document.createElement("a");
    button.classList.add("button");
    button.href = baseURL + `?id=${project.id}`;
    button.textContent = "Open";
    card.appendChild(button);

    return card
}

for(let project of projects) {
    const card = createCard(project);
    projectContainer.appendChild(card);
}
