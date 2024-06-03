import puppeteer from "puppeteer";
const handleSoldNumberTiki = async (productHandle) => {
    if (await productHandle.$('.quantity ') === null) {
        return 'Not available';
    } 
    else return await productHandle.$eval('.quantity ', span => span.innerText);
}

(async () => {
    console.log("Start");
    let timeStart = new Date().getTime();
    const browser = await puppeteer.launch({
        //headless: false,
        defaultViewport: null,
        userDataDir: './tmp',
        //args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.goto(
        "https://tiki.vn/search?q=lan%20ngan%20mui"
    );
    await page.waitForSelector(".jOZPiC");
    console.log("Browser opened");
    const productsHandles = await page.$$(
        " .jOZPiC > div  "
    );
    console.log(productsHandles.length);
    let products = [];
    for (const productHandle of productsHandles) {
        await page.waitForSelector(".ibOlar");
        const name = await productHandle.$eval('.ibOlar', h3 => {
             const anchorText = h3.cloneNode(true).innerHTML; 
            return anchorText.replace(/<i[^>]*>|<\/i>/g, ""); 
        });
        const price = await productHandle.$eval('.price-discount__price', div => div.innerText);
        const soldNumber = await handleSoldNumberTiki(productHandle);
        const link = await productHandle.$eval('.product-item', a => a.href);
        const product = {name, price, soldNumber, link}
        products.push(product);
     }
    let timeEnd = new Date().getTime();
    console.log({"Tiki": products});
    console.log(`Times taken: ${timeEnd - timeStart} ms`);
    await browser.close();
})(); 