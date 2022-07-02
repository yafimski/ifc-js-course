gallery = document.getElementById("gallery");
model_viewer = document.getElementById("modelViewer");

function createModelCard(index, model_url) {
    const model_card = document.createElement("card");
    model_card.classList.add("card");
    
    const svg = document.createElement("svg");
    svg.setAttribute("xmlns", "url(./resources/ifcjs_logo.png)");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("d", "M18 10.031v-6.423l-6.036-3.608-5.964 3.569v6.499l-6 3.224v7.216l6.136 3.492 5.864-3.393 5.864 3.393 6.136-3.492v-7.177l-6-3.3zm-1.143.036l-4.321 2.384v-4.956l4.321-2.539v5.111zm-4.895-8.71l4.272 2.596-4.268 2.509-4.176-2.554 4.172-2.551zm-10.172 12.274l4.778-2.53 4.237 2.417-4.668 2.667-4.347-2.554zm4.917 3.587l4.722-2.697v5.056l-4.722 2.757v-5.116zm6.512-3.746l4.247-2.39 4.769 2.594-4.367 2.509-4.649-2.713zm9.638 6.323l-4.421 2.539v-5.116l4.421-2.538v5.115z");
    model_card.appendChild(svg);
    
    const title = document.createElement("h2");
    title.textContent = "Model #" + index;
    model_card.appendChild(title);
    
    const button = document.createElement("a");
    button.classList.add("button");
    button.href = "./model-viewer.html"
    button.textContent = "Model";
    model_card.appendChild(button);

    model_card.href = model_url;
    // model_card.href = "./viewer.html";
    // model_card.src = model_url

    return model_card
};

// function createModelFrame(model_url) {
//     const model_frame = document.createElement("iframe");
//     model_frame.classList.add("viewer");
//     model_frame.frameborder = 0
//     model_frame.src = model_url;

//     return model_frame
// };

for (let i = 1; i < 6; i++) {
    let index = "0" + i.toString();
    let model_url = "https://ifcjs.github.io/ifcjs-crash-course/sample-apps/" + index + "/";
    gallery.appendChild(createModelCard(i, model_url))
}
