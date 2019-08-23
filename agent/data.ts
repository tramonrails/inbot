import * as fs from "fs"


const images: Object[] = []
const cats = fs.readdirSync("./images")
cats.forEach(file => {
    const image = fs.readFileSync("./images/" + file)
    images.push({ name: file, image: image })
})

export default [
    {
        json: [
            {
                type: "cats",
                query: "https://www.google.com/search?q=cats",
            },
            {
                type: "dogs",
                query: "https://www.google.com/search?q=dogs",
            },
            {
                type: "birds",
                query: "https://www.google.com/search?q=birds",
            },
        ],
    },
    { raw: "Test here!" },
    { images: images },
]
