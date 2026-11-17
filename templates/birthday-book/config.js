
RHK.registerTemplate({

    id: "birthday-book",

    name: "Birthday Memory Book",

    category: "Birthday",

    description: "A beautiful interactive birthday book.",

    fields: [
        {
            name: "personName",
            label: "Birthday Person",
            type: "text",
            placeholder: "Enter their name"
        },
        {
            name: "message",
            label: "Birthday Message",
            type: "textarea",
            placeholder: "Write your birthday message"
        },
        {
            name: "coverText",
            label: "Book Cover Text",
            type: "text",
            placeholder: "A Book of Memories"
        },
        {
            name: "photo1",
            label: "Memory Photo 1",
            type: "image"
        },
        {
            name: "photo2",
            label: "Memory Photo 2",
            type: "image"
        },
        {
            name: "photo3",
            label: "Memory Photo 3",
            type: "image"
        }
    ],

    defaults: {
        personName: "Someone Special",
        message: "May your birthday be filled with happiness, laughter and beautiful memories. You deserve all the wonderful things life has to offer.",
        coverText: "A Book of Memories",
        photo1: "",
        photo2: "",
        photo3: ""
    }

}, BirthdayBook);
