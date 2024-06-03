import puppeteer from 'puppeteer';
const handleSoldNumber = async (productHandle) => {
    if (await productHandle.$('._1cEkb > span') === null) {
        return 'Not available';
    } 
    else return await productHandle.$eval('._1cEkb > span', span => span.innerText);
}

const handleSoldNumberTiki = async (productHandle) => {
    if (await productHandle.$('.quantity ') === null) {
        return 'Not available';
    } 
    else return await productHandle.$eval('.quantity ', span => span.innerText);
}

export const scrapLazada = async (req, res) => {
    const browser = await puppeteer.launch({
        //headless: false,
        defaultViewport: null,
        userDataDir: './tmp',
        //args: ['--start-maximized']
    });
    const page = await browser.newPage();
    try {
        console.log("Scraping Lazada");
        let product = req.params.product;
        product = product.replace(/-/g, "%20");
        let searchLink = `https://www.lazada.vn/catalog/?2&q=${product}`; 
        let timeStart = new Date().getTime();
        console.log("Opening Browser");
        await page.goto(searchLink);
        console.log("Browser opened");
        await page.waitForSelector("._17mcb");
        const productsHandles = await page.$$(
            "._17mcb > div"
        );
        let productsLazada = [];
        for (const productHandle of productsHandles) {
            const name = await productHandle.$eval('.RfADt > a', a => {
                const anchorText = a.cloneNode(true).innerHTML; 
                return anchorText.replace(/<i[^>]*>|<\/i>/g, ""); 
            });
            const price = await productHandle.$eval('.aBrP0 > span', span => span.innerText);
            const soldNumber = await handleSoldNumber(productHandle);
            const link = await productHandle.$eval('.RfADt > a', a => a.href);
            const product = {name, price, soldNumber, link}
            products.push(product);
        }
        let timeEnd = new Date().getTime();
        console.log("Scraping complete");
        res.status(200).json({"Lazada": products, "TimesTakenInMS": timeEnd - timeStart});
        await browser.close();

    } catch (error) {
        res.status(400).json({error});
    } finally {
        await browser.close();
    }
}

export const scrapTiki = async(req, res) => {
    const browser = await puppeteer.launch({
        //headless: false,
        defaultViewport: null,
        userDataDir: './tmp',
        //args: ['--start-maximized']
    });
    const page = await browser.newPage();
    try {
        console.log("Scraping tiki");
        let timeStart = new Date().getTime();
        let product = req.params.product;
        product = product.replace(/-/g, "%20");
        console.log("Opening Browser");
        let searchLink = `https://tiki.vn/search?q=${product}`; 
        await page.goto(searchLink);
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
        res.status(200).json({"Tiki": products, "TimesTakenInMS": timeEnd - timeStart});
        await browser.close();
    } catch (error) {
        console.log("Browser not opened");
        res.status(400).json({error});
    } finally {
        await browser.close();
        console.log("Closing browser");
    }
}

export const scrapShopee = async(req, res) => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: './tmp',
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    try {
        let searchLink = `https://shopee.vn/search?keyword=${req.params.product}`;
        await page.goto(searchLink);
    }
    catch (error) {
        res.status(400).json({error});
    }
}

export const scrapSendo = async(req, res) => { 
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: './tmp',
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    let timeStart = new Date().getTime();
    try {
        let product = req.params.product;
        product = product.replace(/-/g, "%20");
        console.log("Opening Browser");
        let searchLink = `https://www.sendo.vn/tim-kiem?q=${req.params.product}`;
        await page.goto(searchLink);
        console.log("Scraping sendo");

    }
    catch (error) {
        let timeEnd = new Date().getTime();
        console.log("Browser not opened");
        res.status(400).json({error, "TimeTakenInMS": timeEnd - timeStart});
    }
    finally {
        await browser.close();
        console.log("Closing browser");
    }
}