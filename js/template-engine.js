
window.RHK = window.RHK || {};

RHK.registry = {};
RHK.currentInstance = null;
RHK.currentId = null;

RHK.escapeHTML = function(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
};


// REGISTER TEMPLATE

RHK.registerTemplate = function(config, implementation) {

    if (!config || !config.id || !implementation) {
        console.error("Invalid template registration");
        return;
    }

    if (RHK.registry[config.id]) {
        console.error("Duplicate template:", config.id);
        return;
    }

    if (
        typeof implementation.mount !== "function" ||
        typeof implementation.update !== "function" ||
        typeof implementation.destroy !== "function"
    ) {
        console.error("Template must implement mount, update and destroy");
        return;
    }

    RHK.registry[config.id] = {
        config,
        implementation
    };

    console.log("Registered:", config.id);
};


// GET TEMPLATE

RHK.getTemplate = function(id) {
    return RHK.registry[id] || null;
};


// GET ALL REGISTERED TEMPLATES

RHK.getAllTemplates = function() {
    return Object.values(RHK.registry);
};


// DESTROY CURRENT TEMPLATE

RHK.destroyCurrent = function() {

    if (!RHK.currentInstance) return;

    try {
        RHK.currentInstance.destroy();
    } catch(error) {
        console.error("Template cleanup error:", error);
    }

    RHK.currentInstance = null;
    RHK.currentId = null;

};


// LOAD TEMPLATE

RHK.loadTemplate = function(id, container, initialData) {

    const registered = RHK.getTemplate(id);

    if (!registered) {
        throw new Error("Template not registered: " + id);
    }

    RHK.destroyCurrent();

    container.replaceChildren();

    const data = structuredClone(
        initialData || registered.config.defaults
    );

    const instance = registered.implementation;

    instance.mount(container, data);

    RHK.currentInstance = instance;
    RHK.currentId = id;

    return instance;

};


// UPDATE CURRENT TEMPLATE

RHK.updateTemplate = function(data) {

    if (!RHK.currentInstance) return;

    RHK.currentInstance.update(data);

};


// GET DEFAULT DATA

RHK.getDefaultData = function(id) {

    const template = RHK.getTemplate(id);

    if (!template) return {};

    return structuredClone(template.config.defaults);

};


// CLEAN UP WHEN LEAVING

window.addEventListener("pagehide", () => {
    RHK.destroyCurrent();
});
