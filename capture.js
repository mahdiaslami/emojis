const puppeteer = require('puppeteer');
const slugify = require('slugify')

console.log(__dirname, __filename);

async function capture(groupIndex, filename) {
    console.log(`Start capture index ${groupIndex}`)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${__dirname}/index.html?group=${groupIndex}`, { waitUntil: 'networkidle2' });
    await page.setViewport({ height: 500, width: 500 })

    await wait(5000)

    const elem = await page.$('body');
    const boundingBox = await elem.boundingBox();
    console.log(`Reset viewport to HxW: ${boundingBox.height}x${boundingBox.width}`)
    await page.setViewport({ height: boundingBox.height, width: boundingBox.width })

    await wait(1000)

    await page.screenshot({ path: `png/${filename}.png`, omitBackground: true });
    await browser.close();

    console.log(`Image stored as "png/${filename}.png"`);
};

function wait(miliseconds) {
    return new Promise((resolve) => setTimeout(resolve, miliseconds))
}

(async () => {
    const groups = [
        "Smileys and emotions",
        "People",
        "Animals and nature",
        "Food and drink",
        "Travel and places",
        "Activities and events",
        "Objects",
        // "Symbols",
        // "Flags",
    ]

    for (let gi = 0; gi < groups.length; gi++) {
        await capture(gi, slugify(groups[gi], { lower: true }))
    }
})()
