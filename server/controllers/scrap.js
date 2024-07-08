import puppeteer from 'puppeteer';
import Product from '../models/product.js';
import { calculateSimilarityScore } from '../helper/diceCoefficent.js';
import { toLowerCaseNonAccentVietnamese } from '../helper/vietnameseTextToLowerCase.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';
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

const handleSoldNumberHasaki = async (productHandle) => {
    if (await productHandle.$('.item_count_by') === null) {
        return -1;
    }
    else {
        const soldNumberText = await productHandle.$eval('.item_count_by', span => span.innerText);
        return handleNumber(soldNumberText);
    }
}

const handleSoldNumber = async (productHandle, selector) => {
    if (await productHandle.$(selector) === null) {
        return -1;
    }
    else {
        const soldNumberText = await productHandle.$eval(selector, span => span.innerText);
        return handleNumber(soldNumberText);
    }
}

const getKeywords = (str) => {
    return str.trim().toLowerCase().split(' ');
}

const filterProductsByKeywords = (products, keywords, brand, category) => {
    return products.filter(product => {
        const productName = toLowerCaseNonAccentVietnamese(product.name);
        if (!productName.includes(brand) || !productName.includes(category)){
            return false;
        }
        if (keywords.length !== 0) {
            let matchCount = 0;
            for (const keyword of keywords) {
                if (productName.includes(keyword)) {
                    matchCount++;
                }
                if (matchCount >= 2) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    });
}

const handleSoldNumberSendo = async (productHandle) => {
    if (await productHandle.$('.d7ed-CX1CTf') === null) {
        return -1;
    }
    else return await productHandle.$eval('.d7ed-CX1CTf', span => span.innerText);
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
    let timeStart = new Date().getTime();
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
        let id = req.params.id;
        let numberOfProducts = req.params.num || 10;
        const scrapProduct = await Product.findById(id);
        let productName = (scrapProduct.searchName !== '') ? scrapProduct.searchName.replace(/-/g, "%20") : scrapProduct.name.replace(/-/g, "%20");
        productName = toLowerCaseNonAccentVietnamese(productName);
        let searchLink = `https://www.lazada.vn/catalog/?2&q=${productName}`;
        console.log("Scraping Lazada for product:", productName);
        console.log("Opening Browser");
        await page.goto(searchLink, { waitUntil: "domcontentloaded"});
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
            const soldNumber = await handleSoldNumber(productHandle, '._1cEkb > span');
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
            const similarityScore = calculateSimilarityScore(scrapProduct.name, toLowerCaseNonAccentVietnamese(name));
            const product = { name, price, soldNumber, link, similarityScore }
            productsLazada.push(product);
        }
        let keywords = [];
        if (scrapProduct.searchName !== '') {
            keywords = getKeywords(scrapProduct.searchName);
        } 
        let timeEnd = new Date().getTime();
        console.log("Scraping complete");
        console.log("Times taken: ", timeEnd - timeStart);

        const productCategory = await Category.findById(scrapProduct.category);
        productCategory.name = toLowerCaseNonAccentVietnamese(productCategory.name.trim().split(' ')[0]);
        const productBrand = await Brand.findById(scrapProduct.brand);
        productBrand.name = toLowerCaseNonAccentVietnamese(productBrand.name);
        productsLazada = filterProductsByKeywords(productsLazada, keywords, productCategory.name, productBrand.name);

        productsLazada.sort((a, b) => b.similarityScore - a.similarityScore);
        await Product.findByIdAndUpdate(id, { dataFromScrapingLazada: { products: productsLazada.slice(0, numberOfProducts), lastScraped: new Date() }});
        res.status(200).json({ dataFromScrapingLazada: { products: productsLazada.slice(0, numberOfProducts), lastScraped: new Date() }})
    } catch (error) {
        res.status(400).json({ dataFromScrapingLazada: { products: [], lastScraped: new Date() }, error: error.message });
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
    let timeBegin = new Date().getTime();
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
        const id = req.params.id;
        const numberOfProducts = req.params.num || 10;
        const scrapProduct = await Product.findById(id);
        let productName = (scrapProduct.searchName !== '') ? scrapProduct.searchName.replace(/-/g, "%20") : scrapProduct.name.replace(/-/g, "%20");
        productName = toLowerCaseNonAccentVietnamese(productName).trim();
        console.log("Opening Browser");
        let searchLink = `https://tiki.vn/search?q=${productName}`;
        console.log(productName);
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
            const soldNumber = await handleSoldNumber(productHandle, '.quantity');
            const link = await productHandle.$eval('.product-item', a => a.href);
            // const img = await productHandle.$eval('img', img => img.srcset.split(",")[0].split(" ")[0]);
            const similarityScore = calculateSimilarityScore(scrapProduct.name, toLowerCaseNonAccentVietnamese(name));
            const product = { name, price, soldNumber, link, similarityScore }
            products.push(product);
        }

        const productCategory = await Category.findById(scrapProduct.category);
        productCategory.name = toLowerCaseNonAccentVietnamese(productCategory.name.trim().split(' ')[0]);
        const productBrand = await Brand.findById(scrapProduct.brand);
        productBrand.name = toLowerCaseNonAccentVietnamese(productBrand.name);
        let keywords = [];  
        if (scrapProduct.searchName !== '') {
            keywords = getKeywords(scrapProduct.searchName);
        }
        products = filterProductsByKeywords(products, keywords, productCategory.name, productBrand.name);
        products.sort((a, b) => b.similarityScore - a.similarityScore);
        let timeEnd = new Date().getTime();
        console.log("Scraping complete");
        console.log("Times taken: ", timeEnd - timeBegin);
        await browser.close();
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

const retry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (err) {
        if (retries > 0) {
            console.log(`Retrying... Attempts left: ${retries}`);
            await new Promise(res => setTimeout(res, delay));
            return retry(fn, retries - 1, delay);
        } else {
            throw err;
        }
    }
};

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
    try {
        let id = req.params.id;
        let numberOfProducts = req.params.num || 5;
        const scrapProduct = await Product.findById(id);
        let productName = (scrapProduct.searchName !== '') ? scrapProduct.searchName.replace(/-/g, "%20") : scrapProduct.name.replace(/-/g, "%20");
        productName = toLowerCaseNonAccentVietnamese(productName);
        console.log("Opening Browser");
        let searchLink = `https://www.sendo.vn/tim-kiem?q=${productName}`;
        await page.goto(searchLink);
        console.log("Scraping sendo");
        await page.waitForSelector(".d7ed-fdSIZS .d7ed-OoK3wU .d7ed-mPGbtR");
        const productsHandles = await page.$$(
            ".d7ed-fdSIZS .d7ed-OoK3wU .d7ed-mPGbtR > div"
        );
        console.log(productsHandles.length);
        let products = [];
        for (const productHandle of productsHandles) {
            try {
                await page.waitForSelector('.d7ed-mzOLVa', { timeout: 10000 });
                const nameHandle = await productHandle.$('.d7ed-mzOLVa');
                if (nameHandle) {
                    const name = await nameHandle.evaluate(span => span.innerText);
                    const price = await productHandle.$eval('.d7ed-AHa8cD', span => span.innerText);
                    const soldNumber = await handleSoldNumber(productHandle, '.d7ed-CX1CTf > span');
                    const link = await productHandle.$eval('.d7ed-d4keTB.d7ed-OoK3wU > a', a => a.href);
                    const similarityScore = calculateSimilarityScore(scrapProduct.name, toLowerCaseNonAccentVietnamese(name));
                    const product = { name, price, soldNumber, link, similarityScore };
                    products.push(product);
                } 
            } catch (error) {
                console.log("Error while scraping product:", error);
            }
        }
        console.log("Scraping complete");
        const productCategory = await Category.findById(scrapProduct.category);
        productCategory.name = toLowerCaseNonAccentVietnamese(productCategory.name.trim().split(' ')[0]);
        const productBrand = await Brand.findById(scrapProduct.brand);
        productBrand.name = toLowerCaseNonAccentVietnamese(productBrand.name);
        let keywords = [];
        if (scrapProduct.searchName !== '') {
            keywords = getKeywords(scrapProduct.searchName);
        }
        products = filterProductsByKeywords(products, keywords, productCategory.name, productBrand.name);
        products.sort((a, b) => b.similarityScore - a.similarityScore);
        if (products.length > 0) {
            await Product.findByIdAndUpdate(id, { dataFromScrapingSendo: { products: products.slice(0, numberOfProducts), lastScraped: new Date() }});
        }
        res.status(200).json({ dataFromScrapingSendo: { products: products.slice(0, numberOfProducts), lastScraped: new Date() }});
    }
    catch (error) {
        console.log("Error");
        res.status(400).json({ error: error.message});
    } finally {
        await browser.close();
    }
}

export const scrapHasaki = async (req, res) => {
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
        let id = req.params.id;
        let numberOfProducts = req.params.num || 5;
        const scrapProduct = await Product.findById(id);
        let productName = (scrapProduct.searchName !== '') ? scrapProduct.searchName.replace(/-/g, "%20") : scrapProduct.name.replace(/-/g, "%20");
        productName = toLowerCaseNonAccentVietnamese(productName);
        console.log("Opening Browser");
        let searchLink = `https://hasaki.vn/catalogsearch/result/?q=${productName}`;
        console.log(productName);
        await page.goto(searchLink, { waitUntil: 'domcontentloaded' });
        console.log("Scraping Hasaki");
        await page.waitForSelector(".list_product");
        const productsHandles = await page.$$(".list_product > div");
        console.log(productsHandles.length);    
        let productsHasaki = [];
        for (const productHandle of productsHandles) {
            const name = await productHandle.$eval('.vn_names', div => div.innerText);
            const price = await productHandle.$eval('.item_giamoi', strong => strong.innerText);
            const soldNumber = await handleSoldNumber(productHandle, '.item_count_by');
            const link = await productHandle.$eval('.block_info_item_sp', a => a.href);
            const similarityScore = calculateSimilarityScore(scrapProduct.name, toLowerCaseNonAccentVietnamese(name));
            const product = { name, price, soldNumber, link, similarityScore };
            productsHasaki.push(product);
        }
        console.log("Scraping complete");
        const productCategory = await Category.findById(scrapProduct.category);
        productCategory.name = toLowerCaseNonAccentVietnamese(productCategory.name.trim().split(' ')[0]);
        const productBrand = await Brand.findById(scrapProduct.brand);
        productBrand.name = toLowerCaseNonAccentVietnamese(productBrand.name);
        let keywords = [];
        if (scrapProduct.searchName !== '') {
            keywords = getKeywords(scrapProduct.searchName);
        }
        productsHasaki = filterProductsByKeywords(productsHasaki, keywords, productCategory.name, productBrand.name);
        productsHasaki.sort((a, b) => b.similarityScore - a.similarityScore);
        await Product.findByIdAndUpdate(id, { dataFromScrapingHasaki: { products: productsHasaki.slice(0, numberOfProducts), lastScraped: new Date() }});
        res.status(200).json({ dataFromScrapingHasaki: { products: productsHasaki.slice(0, numberOfProducts), lastScraped: new Date() }});
    } catch (error) {
        console.log("Error");
        res.status(400).json({ error: error.message });
    }
    finally {
        await browser.close();
    }
};

export const scrapBeautyBox = async (req, res) => {
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
        let id = req.params.id;
        let numberOfProducts = req.params.num || 5;
        const scrapProduct = await Product.findById(id);
        let productName = (scrapProduct.searchName !== '') ? scrapProduct.searchName.replace(/-/g, "%20") : scrapProduct.name.replace(/-/g, "%20");
        productName = toLowerCaseNonAccentVietnamese(productName).trim();
        console.log("Opening Browser");
        let searchLink = `https://beautybox.com.vn/search?searchValue=${productName}`;
        console.log(productName);
        await page.goto(searchLink, { waitUntil: 'domcontentloaded' });
        console.log(searchLink);
        console.log("Scraping BeautyBox");
        await page.waitForSelector(".ant-row");
        const productsHandles = await page.$$(".ant-col-sm-8");
        console.log(productsHandles.length);
        let productsBeautyBox = [];
        for (const productHandle of productsHandles) {
            const name = await productHandle.$eval('.', div => div.innerText);
            const product = { name }
            productsBeautyBox.push(product);
        }
        console.log("Scraping complete");
        res.status(200).json({ "BeautyBox": productsBeautyBox});
    } catch (error) {
        console.log("Error");
        res.status(400).json({ error: error.message });
    }
    finally {
        await browser.close();
    }
}