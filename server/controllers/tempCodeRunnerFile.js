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