
const BirthdayBook = {

    container: null,
    data: {},
    page: 0,

    mount(container, data) {

        this.container = container;
        this.page = 0;
        this.update(data);

    },

    update(data) {

        this.data = data;

        const safe = RHK.escapeHTML;

        const photos = [
            data.photo1,
            data.photo2,
            data.photo3
        ];

        const photoHTML = photos.map((photo, index) => {

            const image = photo
                ? `<img src="${safe(photo)}" alt="Memory ${index + 1}">`
                : `<div class="book-placeholder">✦<small>Memory ${index + 1}</small></div>`;

            return `
                <div class="book-memory">
                    ${image}
                </div>
            `;

        }).join("");

        this.container.innerHTML = `

            <div class="bb-template">

                <div class="bb-heading">
                    <span>✦ A SPECIAL CELEBRATION ✦</span>
                    <h1>Happy Birthday</h1>
                    <p>${safe(data.personName)}</p>
                </div>

                <div class="bb-book-area">

                    <div class="bb-book" id="bbBook">

                        <div class="bb-cover" id="bbCover">

                            <div class="bb-cover-decoration">✧</div>

                            <div class="bb-cover-title">
                                <small>THE SPECIAL EDITION</small>
                                <h2>${safe(data.coverText)}</h2>
                                <span>FOR ${safe(data.personName).toUpperCase()}</span>
                            </div>

                            <div class="bb-cover-bottom">♥</div>

                        </div>

                        <div class="bb-page" id="bbPage">

                            <div class="bb-page-content" id="bbPageContent"></div>

                        </div>

                    </div>

                </div>

                <div class="bb-controls">
                    <button id="bbPrev">← Previous</button>
                    <span id="bbPageNumber">COVER</span>
                    <button id="bbNext">Next →</button>
                </div>

                <p class="bb-hint" id="bbHint">
                    Open the book to discover your memories
                </p>

            </div>

        `;

        this.renderPage();

        this.container.querySelector("#bbNext")
            .addEventListener("click", () => this.nextPage());

        this.container.querySelector("#bbPrev")
            .addEventListener("click", () => this.previousPage());

    },

    renderPage() {

        const content = this.container.querySelector("#bbPageContent");
        const number = this.container.querySelector("#bbPageNumber");
        const book = this.container.querySelector("#bbBook");
        const hint = this.container.querySelector("#bbHint");

        if (this.page === 0) {

            book.classList.remove("opened");

            number.textContent = "COVER";

            content.innerHTML = `
                <div class="bb-inside-message">
                    <span>✦</span>
                    <h2>A Little Surprise</h2>
                    <p>Turn the pages to see something special.</p>
                </div>
            `;

            hint.textContent = "Tap Next to open the book";

        } else if (this.page === 1) {

            book.classList.add("opened");

            number.textContent = "PAGE 01";

            content.innerHTML = `
                <div class="bb-inside-message">
                    <span>🎂</span>
                    <h2>Happy Birthday!</h2>
                    <p>${RHK.escapeHTML(this.data.personName)}</p>
                    <p>${RHK.escapeHTML(this.data.message)}</p>
                </div>
            `;

            hint.textContent = "A message made especially for you";

        } else {

            book.classList.add("opened");

            const index = this.page - 2;

            number.textContent = "PAGE 0" + this.page;

            const photos = [
                this.data.photo1,
                this.data.photo2,
                this.data.photo3
            ];

            const photo = photos[index];

            content.innerHTML = `
                <div class="bb-memory-page">

                    ${
                        photo
                        ? `<img src="${RHK.escapeHTML(photo)}" alt="Memory">`
                        : `<div class="bb-empty-photo">📸<span>Add your photo in the editor</span></div>`
                    }

                    <h3>Beautiful Memory ${index + 1}</h3>

                    <p>A moment worth remembering forever.</p>

                </div>
            `;

            hint.textContent = "Turn the page for another memory";

        }

        this.container.querySelector("#bbPrev").disabled =
            this.page === 0;

        this.container.querySelector("#bbNext").disabled =
            this.page === 4;

    },

    nextPage() {

        if (this.page < 4) {
            this.page++;
            this.renderPage();
        }

    },

    previousPage() {

        if (this.page > 0) {
            this.page--;
            this.renderPage();
        }

    },

    destroy() {

        this.container = null;
        this.data = {};
        this.page = 0;

    }

};
