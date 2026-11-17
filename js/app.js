
document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTS

    const homeContent = document.getElementById("homeContent");
    const previewPage = document.getElementById("previewPage");

    const categoryGrid = document.getElementById("categoryGrid");
    const trendingGrid = document.getElementById("trendingGrid");
    const allTemplatesGrid = document.getElementById("allTemplatesGrid");

    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");

    const filterRow = document.getElementById("filterRow");
    const resultCount = document.getElementById("resultCount");
    const emptyState = document.getElementById("emptyState");

    const mainApp = document.getElementById("mainApp");

    let activeCategory = "all";
    let activeFilter = "all";
    let currentSearch = "";
    let currentTemplate = null;


    // SAFE HTML

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }


    // TOAST

    let toastTimer;

    function showToast(message) {

        const toast = document.getElementById("toast");

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);

    }


    // CATEGORY RENDERING

    function renderCategories() {

        categoryGrid.innerHTML = RHK_CATEGORIES.map(category => {

            const selected = activeCategory === category.id
                ? "selected"
                : "";

            return `
                <button
                    class="category-card ${selected}"
                    data-category="${escapeHTML(category.id)}"
                >
                    <div class="category-icon">
                        ${category.emoji}
                    </div>

                    <strong>${escapeHTML(category.name)}</strong>

                    <small>${escapeHTML(category.count)}</small>
                </button>
            `;

        }).join("");

    }


    // TEMPLATE CARD

    function createTemplateCard(template) {

        const accessLabel = template.access === "premium"
            ? "✦ PREMIUM"
            : "FREE";

        return `
            <article
                class="template-card"
                data-open-template="${escapeHTML(template.id)}"
                tabindex="0"
                role="button"
                aria-label="Preview ${escapeHTML(template.title)}"
            >

                <div
                    class="template-cover"
                    style="--cover:${template.cover}"
                >

                    <span class="template-type ${template.access}">
                        ${accessLabel}
                    </span>

                    <div class="cover-emoji">
                        ${template.emoji}
                    </div>

                </div>

                <div class="template-info">

                    <h3>${escapeHTML(template.title)}</h3>

                    <p>${escapeHTML(template.description)}</p>

                    <div class="template-card-bottom">

                        <span class="template-category">
                            ${escapeHTML(template.categoryName)}
                        </span>

                        <button
                            class="preview-small-btn"
                            data-open-template="${escapeHTML(template.id)}"
                        >
                            Preview ↗
                        </button>

                    </div>

                </div>

            </article>
        `;

    }


    // TRENDING

    function renderTrending() {

        const trending = RHK_TEMPLATES.filter(
            template => template.trending
        );

        trendingGrid.innerHTML = trending
            .map(createTemplateCard)
            .join("");

    }


    // FILTER ALL TEMPLATES

    function getFilteredTemplates() {

        return RHK_TEMPLATES.filter(template => {

            const matchesCategory =
                activeCategory === "all" ||
                template.category === activeCategory;

            const matchesAccess =
                activeFilter === "all" ||
                template.access === activeFilter;

            const query = currentSearch.toLowerCase();

            const matchesSearch =
                template.title.toLowerCase().includes(query) ||
                template.categoryName.toLowerCase().includes(query) ||
                template.description.toLowerCase().includes(query);

            return matchesCategory && matchesAccess && matchesSearch;

        });

    }


    // RENDER ALL

    function renderTemplates() {

        const filtered = getFilteredTemplates();

        allTemplatesGrid.innerHTML = filtered
            .map(createTemplateCard)
            .join("");

        resultCount.textContent =
            filtered.length + " templates";

        emptyState.classList.toggle(
            "hidden",
            filtered.length !== 0
        );

    }


    // RENDER EVERYTHING

    function renderApp() {

        renderCategories();
        renderTrending();
        renderTemplates();

        document.getElementById("templateCount").textContent =
            String(RHK_TEMPLATES.length).padStart(2, "0");

    }


    // SEARCH

    searchInput.addEventListener("input", () => {

        currentSearch = searchInput.value.trim();

        clearSearch.style.display =
            currentSearch ? "block" : "none";

        renderTemplates();

        if (currentSearch) {
            activeCategory = "all";
            renderCategories();
        }

    });


    clearSearch.addEventListener("click", () => {

        searchInput.value = "";
        currentSearch = "";

        clearSearch.style.display = "none";

        renderApp();

    });


    // CATEGORY CLICK

    categoryGrid.addEventListener("click", event => {

        const button = event.target.closest("[data-category]");

        if (!button) return;

        activeCategory = button.dataset.category;

        renderCategories();
        renderTemplates();

        document.getElementById("allTemplatesSection")
            .scrollIntoView({ behavior: "smooth" });

    });


    // FREE / PREMIUM FILTER

    filterRow.addEventListener("click", event => {

        const button = event.target.closest("[data-filter]");

        if (!button) return;

        activeFilter = button.dataset.filter;

        document.querySelectorAll(".filter-chip").forEach(chip => {
            chip.classList.toggle(
                "active",
                chip.dataset.filter === activeFilter
            );
        });

        renderTemplates();

    });


    // OPEN TEMPLATE PREVIEW

    function openTemplate(id) {

        const template = RHK_TEMPLATES.find(
            item => item.id === id
        );

        if (!template) {
            showToast("Template not found");
            return;
        }

        history.pushState(
            { template: id },
            "",
            "?template=" + encodeURIComponent(id)
        );

        renderPreview(template);

    }


    // RENDER PREVIEW

    function renderPreview(template) {

        currentTemplate = template;

        homeContent.classList.add("hidden");
        previewPage.classList.remove("hidden");

        document.getElementById("searchSection")
            .classList.add("hidden");

        const cover = document.getElementById("previewCover");

        cover.style.setProperty("--cover", template.cover);

        document.getElementById("previewCategory").textContent =
            template.categoryName;

        document.getElementById("previewEmoji").textContent =
            template.emoji;

        document.getElementById("previewTitle").textContent =
            template.title;

        document.getElementById("previewDescription").textContent =
            template.description;

        document.getElementById("previewName").textContent =
            template.title;

        document.getElementById("previewAccess").textContent =
            template.access === "premium" ? "✦ PREMIUM" : "FREE";

        document.getElementById("previewLongDescription").textContent =
            template.longDescription;

        document.getElementById("previewCategoryInfo").textContent =
            template.categoryName;

        document.getElementById("previewExperience").textContent =
            template.experience;

        document.getElementById("previewId").textContent =
            template.id;

        document.title =
            template.title + " | RHK WISHES";

        window.scrollTo({ top: 0, behavior: "instant" });

        updateNavigation("explore");

    }


    // CLOSE PREVIEW

    function closePreview() {

        currentTemplate = null;

        previewPage.classList.add("hidden");
        homeContent.classList.remove("hidden");

        document.getElementById("searchSection")
            .classList.remove("hidden");

        document.title =
            "RHK WISHES | Create Something Special";

        updateNavigation("home");

        window.scrollTo({ top: 0, behavior: "instant" });

    }


    // OPEN/CLOSE PREVIEW CLICK

    mainApp.addEventListener("click", event => {

        const target = event.target.closest("[data-open-template]");

        if (!target) return;

        openTemplate(target.dataset.openTemplate);

    });


    // BACK BUTTONS

    function goBackToTemplates() {

        if (currentTemplate) {
            history.back();
        }

    }

    document.getElementById("backButton")
        .addEventListener("click", goBackToTemplates);

    document.getElementById("previewBackButton")
        .addEventListener("click", goBackToTemplates);


    // USE TEMPLATE

    document.getElementById("useTemplateButton")
        .addEventListener("click", () => {

            if (!currentTemplate) return;

            showToast(
                "Editor will be available in Phase 2."
            );

        });


    // BROWSER BACK/FORWARD

    window.addEventListener("popstate", () => {

        const params = new URLSearchParams(location.search);
        const id = params.get("template");

        if (id) {

            const template = RHK_TEMPLATES.find(
                item => item.id === id
            );

            if (template) {
                renderPreview(template);
            } else {
                closePreview();
            }

        } else {

            closePreview();

        }

    });


    // INITIAL URL SUPPORT

    function loadInitialRoute() {

        const params = new URLSearchParams(location.search);
        const id = params.get("template");

        if (id) {

            const template = RHK_TEMPLATES.find(
                item => item.id === id
            );

            if (template) {
                renderPreview(template);
                return;
            }

        }

        closePreview();

    }


    // NAVIGATION

    function updateNavigation(active) {

        document.querySelectorAll(".nav-item").forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.nav === active
            );

        });

    }


    document.querySelector(".bottom-nav")
        .addEventListener("click", event => {

            const item = event.target.closest("[data-nav]");

            if (!item) return;

            const page = item.dataset.nav;

            updateNavigation(page);

            if (page === "home") {

                if (currentTemplate) {
                    history.back();
                } else {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }

            }

            else if (page === "explore") {

                if (currentTemplate) {
                    history.back();
                } else {
                    document.getElementById("allTemplatesSection")
                        .scrollIntoView({ behavior: "smooth" });
                }

            }

            else if (page === "projects") {

                showToast("My Projects will be available in Phase 3.");

            }

            else if (page === "profile") {

                showToast("Account system will be available in Phase 4.");

            }

        });


    // HEADER SEARCH

    document.getElementById("searchToggle")
        .addEventListener("click", () => {

            if (currentTemplate) return;

            document.getElementById("searchSection")
                .scrollIntoView({ behavior: "smooth" });

            searchInput.focus();

        });


    // EXPLORE BUTTON

    document.getElementById("exploreButton")
        .addEventListener("click", () => {

            document.getElementById("allTemplatesSection")
                .scrollIntoView({ behavior: "smooth" });

        });


    // SEE ALL

    document.getElementById("seeAllButton")
        .addEventListener("click", () => {

            document.getElementById("allTemplatesSection")
                .scrollIntoView({ behavior: "smooth" });

        });


    // RESET SEARCH

    document.getElementById("resetSearch")
        .addEventListener("click", () => {

            searchInput.value = "";
            currentSearch = "";
            activeCategory = "all";
            activeFilter = "all";

            clearSearch.style.display = "none";

            document.querySelectorAll(".filter-chip")
                .forEach(chip => {
                    chip.classList.toggle(
                        "active",
                        chip.dataset.filter === "all"
                    );
                });

            renderApp();

        });


    // PROFILE DEMO

    document.getElementById("profileButton")
        .addEventListener("click", () => {

            showToast("Account system coming soon.");

        });


    // INITIALIZE

    renderApp();
    loadInitialRoute();

});
          
