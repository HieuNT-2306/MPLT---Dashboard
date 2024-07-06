import puppeteer from 'puppeteer';
import Product from '../models/product.js';
const handleSoldNumberLazada = async (productHandle) => {
    if (await productHandle.$('._1cEkb > span') === null) {
        return -1;
    }
    else {
        const soldNumberText = await productHandle.$eval('._1cEkb > span', span => span.innerText);
        return handleNumber(soldNumberText);
    } 
}

const handleSoldNumberTiki = async (productHandle) => {
    if (await productHandle.$('.quantity ') === null) {
        return -1;
    }
    else {
        const soldNumberText = await productHandle.$eval('.quantity ', span => span.innerText);
        return handleNumber(soldNumberText);
    }
}

const handleSoldNumberSendo = async (productHandle) => {
    if (await productHandle.$('.d7ed-bm83Kw') === null) {
        return -1;
    }
    else return await productHandle.$eval('.d7ed-bm83Kw', span => span.innerText);
}

const toLowerCaseNonAccentVietnamese = (str) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
    return str;
}

const handleNumber = (number) => {
    const numberText = number.replace(/[^\d.]/g, '');
    let cleanedNumber = parseFloat(numberText, 10);
    if (number.includes('K')) {
        cleanedNumber *= 1000;
    }
    return cleanedNumber;
};


// export const scrapLazada = async (req, res) => {
//     const browser = await puppeteer.launch({
//         headless: false,
//         defaultViewport: null,
//         userDataDir: './tmp',
//     });
//     const page = await browser.newPage();
//     await page.setRequestInterception(true);
//     page.on('request', (req) => {
//         if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
//             req.abort();
//         }
//         else {
//             req.continue();
//         }
//     });
//     try {
//         console.log("Begin");
//         console.log("Scraping Lazada");
//         let id = req.params.id;
//         let numberOfProducts = req.params.num || 5;
//         const product = await Product.findById(id);
//         let productName = product.name.replace(/-/g, "%20");
//         productName = toLowerCaseNonAccentVietnamese(productName);
//         console.log("Product name: ", productName);
//         let searchLink = `https://www.lazada.vn/catalog/?2&q=${productName}`;
//         let timeStart = new Date().getTime();
//         console.log("Opening Browser");
//         await page.goto(searchLink);
//         console.log("Browser opened");
//         await page.waitForSelector("._17mcb");
//         console.log("Scraping for products in ._17mcb");
//         const productsHandles = await page.$$(
//             "._17mcb > div"
//         );
//         let productsLazada = [];
//         for (const productHandle of productsHandles) {
//             const name = await productHandle.$eval('.RfADt > a', a => {
//                 const anchorText = a.cloneNode(true).innerHTML;
//                 return anchorText.replace(/<i[^>]*>|<\/i>/g, "");
//             });
//             const price = await productHandle.$eval('.aBrP0 > span', span => span.innerText);
//             const soldNumber = await handleSoldNumber(productHandle);
//             const link = await productHandle.$eval('.RfADt > a', a => a.href);
//             const product = { name, price, soldNumber, link }
//             productsLazada.push(product);
//         }
//         console.log("Scraping complete");
//         productsLazada.sort((a, b) => b.soldNumber - a.soldNumber);
//         let timeEnd = new Date().getTime();
//         console.log("Scraping complete");
//         console.log("Times taken: ", timeEnd - timeStart);
//         await Product.findByIdAndUpdate(id, { dataFromScrapingLazada: { products: productsLazada.slice(0, numberOfProducts), lastScraped: new Date() }});
//         res.status(200).json({ dataFromScrapingLazada: { products: productsLazada.slice(0, numberOfProducts), lastScraped: new Date() }})

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     } finally {
//         await browser.close();
//     }
// }

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
        let id = req.params.id;
        let numberOfProducts = req.params.num || 5;
        const product = await Product.findById(id);
        let productName = (product.searchName != '') ? product.searchName.replace(/-/g, "%20") : product.name.replace(/-/g, "%20");
        productName = toLowerCaseNonAccentVietnamese(productName);
        let searchLink = `https://www.lazada.vn/catalog/?2&q=${productName}`;
        console.log(productName)
        console.log("Opening Browser");
        await page.goto(searchLink);
        console.log("Browser opened");
        await page.waitForSelector("._17mcb");
        console.log("Scraping for products in ._17mcb");
        const productsHandles = await page.$$(
            "._17mcb > div"
        );
        let productsLazada = [];
        console.log(productsHandles.length);

        for (const productHandle of productsHandles) {
            const name = await productHandle.$eval('.RfADt > a', a => {
                const anchorText = a.cloneNode(true).innerHTML;
                return anchorText.replace(/<i[^>]*>|<\/i>/g, "");
            });
            const price = await productHandle.$eval('.aBrP0 > span', span => span.innerText);
            const soldNumber = await handleSoldNumberLazada(productHandle);
            const link = await productHandle.$eval('.RfADt > a', a => a.href);
            // const img = await productHandle.$eval('.picture-wrapper.jBwCF > img', async img => {
            //     await new Promise((resolve, reject) => {
            //         if (img.complete) {
            //             resolve();
            //         } else {
            //             img.addEventListener('load', resolve);
            //             img.addEventListener('error', reject);
            //         }
            //     });
            //     return img;
            // });
            // const img = await productHandle.$eval('.picture-wrapper.jBwCF > img', img => img.src);
            const product = { name, price, soldNumber, link }
            productsLazada.push(product);
        }
        console.log("Scraping complete");
        await browser.close();
        //return { "Lazada": productsLazada, "TimesTakenInMS": timeEnd - timeStart };
        
        productsLazada.sort((a, b) => b.soldNumber - a.soldNumber);
        await Product.findByIdAndUpdate(id, { dataFromScrapingLazada: { products: productsLazada.slice(0, numberOfProducts), lastScraped: new Date() }});
        res.status(200).json({ dataFromScrapingLazada: { products: productsLazada.slice(0, numberOfProducts), lastScraped: new Date() }})
    } catch (error) {
        res.status(400).json({ error: error.message });
    } finally {
        await browser.close();
    }
}


export const scrapTiki = async (req, res) => {
    const browser = await puppeteer.launch({
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
        const id = req.params.id;
        const numberOfProducts = req.params.num || 5;
        const product = await Product.findById(id);
        let productName = product.name.replace(/-/g, "%20");
        console.log("Opening Browser");
        let searchLink = `https://tiki.vn/search?q=${productName}`;
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
            // const img = await productHandle.$eval('img', img => img.srcset.split(",")[0].split(" ")[0]);
            const product = { name, price, soldNumber, link }
            products.push(product);
        }
        let timeEnd = new Date().getTime();
        products.sort((a, b) => b.soldNumber - a.soldNumber);
        
        await browser.close();
        console.log("Times taken: ", timeEnd - timeStart);
        await Product.findByIdAndUpdate(id, { dataFromScrapingTiki: { products: products.slice(0, numberOfProducts), lastScraped: new Date() }});
        res.status(200).json({ dataFromScrapingTiki: { products: products.slice(0, numberOfProducts), lastScraped: new Date() }});
    } catch (error) {
        console.log("Browser not opened");
        res.status(400).json({ error: error.message });
    }
    finally {
        await browser.close();
    }
}

export const scrapSendo = async (req, res) => {
    const browser = await puppeteer.launch({
        headless: false, 
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
        let id = req.params.id;
        let numberOfProducts = req.params.num || 5;
        const product = await Product.findById(id);
        let productName = product.name.replace(/-/g, "%20");
        console.log("Opening Browser");
        let searchLink = `https://www.sendo.vn/tim-kiem?q=${productName}`;
        await page.goto(searchLink);
        console.log("Scraping sendo 2");
        await page.waitForSelector(".d7ed-fdSIZS .d7ed-OoK3wU .d7ed-mPGbtR");
        const productsHandles = await page.$$(
            ".d7ed-fdSIZS .d7ed-OoK3wU .d7ed-mPGbtR > div"
        );
        console.log(productsHandles.length);
        let products = [];
        //await ppage.waitForSelector('.d7ed-fMmmQd.d7ed-_Q8WLO.d7ed-gGVrsi.d7ed-ZnDqnD._0032-L_KUfn.d7ed-OoK3wU')
        for (const productHandle of productsHandles) {
            //const name = await productHandle.$eval('.d7ed-fMmmQd > span', span => span.innerText);
            //const price = await productHandle.$eval('.d7ed-AHa8cD', span => span.innerText);
            //const soldNumber = await handleSoldNumberSendo(productHandle);
            //const link = await productHandle.$eval('.d7ed-d4keTB.d7ed-OoK3wU > a', a => a.href);
            //const product = { name, price, soldNumber, link }
            //products.push(product);
        }
        let timeEnd = new Date().getTime();
        console.log("Scraping complete");
        //res.status(200).json({ "Sendo": products, "TimesTakenInMS": timeEnd - timeStart });
        products.sort((a, b) => b.soldNumber - a.soldNumber);
        res.status(200).json({ "Sendo": products.slice(0, numberOfProducts), "TimesTakenInMS": timeEnd - timeStart });
    }
    catch (error) {
        let timeEnd = new Date().getTime();
        console.log("Error");
        res.status(400).json({ error: error.message, "TimeTakenInMS": timeEnd - timeStart });
    } finally {
        await browser.close();
    }
}