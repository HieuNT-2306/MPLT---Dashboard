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

const handleSoldNumberSendo = async (productHandle) => {
    if (await productHandle.$('.d7ed-UkcyG6') === null) {
        return 'Not available';
    }
    else return await productHandle.$eval('.d7ed-CX1CTf._0032-xSm9nl.d7ed-fdSIZS.d7ed-w9YXDo.d7ed-UkcyG6 > span', span => span.innerText);
}

export const scrapLazada = async (req, res) => {
    const browser = await puppeteer.launch({
        defaultViewport: null,
        userDataDir: './tmp',
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
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
        console.log("Scraping for products in ._17mcb");
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
            const product = { name, price, soldNumber, link }
            productsLazada.push(product);
        }
        let timeEnd = new Date().getTime();
        console.log("Scraping complete");
        await browser.close();
        //return { "Lazada": productsLazada, "TimesTakenInMS": timeEnd - timeStart };
        res.status(200).json({ "Lazada": productsLazada, "TimesTakenInMS": timeEnd - timeStart })

    } catch (error) {
        res.status(400).json({ error });
    } finally {
        await browser.close();
    }
}

export const scrapTiki = async (req, res) => {
    const browser = await puppeteer.launch({
        //headless: false,
        defaultViewport: null,
        userDataDir: './tmp',
        //args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
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
            const product = { name, price, soldNumber, link }
            products.push(product);
        }
        let timeEnd = new Date().getTime();
        await browser.close();
        res.status(200).json({ "Tiki": products, "TimesTakenInMS": timeEnd - timeStart });
    } catch (error) {
        console.log("Browser not opened");
        res.status(400).json({ error });
    }
}

export const scrapSendo = async (req, res) => {
    const browser = await puppeteer.launch({
        defaultViewport: null,
        userDataDir: './tmp',
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    let timeStart = new Date().getTime();
    try {
        let product = req.params.product;
        product = product.replace(/-/g, "%20");
        console.log("Opening Browser");
        let searchLink = `https://www.sendo.vn/tim-kiem?q=${req.params.product}`;
        await page.goto(searchLink);
        console.log("Scraping sendo");
        await page.waitForSelector(".d7ed-fdSIZS .d7ed-OoK3wU .d7ed-mPGbtR");
        const productsHandles = await page.$$(
            ".d7ed-fdSIZS .d7ed-OoK3wU .d7ed-mPGbtR > div"
        );
        console.log(productsHandles.length);
        let products = [];
        for (const productHandle of productsHandles) {
            const name = await productHandle.$eval('.d7ed-Vp2Ugh', span => span.innerText);
            const price = await productHandle.$eval('.d7ed-AHa8cD', span => span.innerText);
            const soldNumber = await handleSoldNumberSendo(productHandle);
            const link = await productHandle.$eval('.d7ed-d4keTB.d7ed-OoK3wU > a', a => a.href);
            const product = { name, price, soldNumber,link }
            products.push(product);
        }
        let timeEnd = new Date().getTime();
        console.log("Scraping complete");
        //res.status(200).json({ "Sendo": products, "TimesTakenInMS": timeEnd - timeStart });
        await browser.close();
        res.status(200).json({ "Sendo": products, "TimesTakenInMS": timeEnd - timeStart });
    }
    catch (error) {
        let timeEnd = new Date().getTime();
        console.log("Error");
        res.status(400).json({ error: error.message, "TimeTakenInMS": timeEnd - timeStart });
    }
}

export const scrapAll = async (req, res) => {
    try {
        console.log("Scraping all");
        let timeStart = new Date().getTime();

        // Execute both functions concurrently
        const [lazadaResult, tikiResult, sendoResult] = await Promise.all([
            scrapLazada(req, res),
            scrapTiki(req, res),
            scrapSendo(req, res) 
        ]);

        let timeEnd = new Date().getTime();
        console.log("Scraping complete");

        // Combine the results
        res.status(200).json({
            "Lazada": lazadaResult,
            "Tiki": tikiResult,
            "Sendo": sendoResult,
            "TimesTakenInMS": timeEnd - timeStart
        });
    } catch (error) {
        res.status(400).json({ error });
    }
}