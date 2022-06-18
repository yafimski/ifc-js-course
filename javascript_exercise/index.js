gallery = document.getElementById("gallery");
model_viewer = document.getElementById("modelViewer");

function createModelCard(index, model_url) {
    const model_card = document.createElement('a');
    model_card.classList.add("card");
    model_card.textContent = "BIM Model #" + index;
    model_card.style.backgroundImage = "url(./resources/ifcjs_logo.png)";
    model_card.style.backgroundRepeat = "no-repeat";
    model_card.style.backgroundPosition = "center";
    model_card.style.backgroundSize = "contain";
    model_card.style.opacity = 0.8;
    model_card.href = model_url;
    // model_card.href = "./viewer.html";
    // model_card.src = model_url

    return model_card
};

// function createModelFrame(model_url) {
//     const model_frame = document.createElement('iframe');
//     model_frame.classList.add("viewer");
//     model_frame.frameborder = 0
//     model_frame.src = model_url;

//     return model_frame
// };

for (let i = 1; i < 6; i++) {
    let index = '0' + i.toString();
    let model_url = "https://ifcjs.github.io/ifcjs-crash-course/sample-apps/" + index + "/";
    gallery.appendChild(createModelCard(i, model_url))
}
