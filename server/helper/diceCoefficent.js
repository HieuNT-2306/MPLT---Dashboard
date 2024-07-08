const diceCoefficient = (a, b) => {
    const bigrams = (str) => {
        let s = str.toLowerCase();
        const v = new Set();
        for (let i = 0; i < s.length - 1; i++) {
            v.add(s.slice(i, i + 2));
        }
        return v;
    }
    const intersection = (setA, setB) => {
        const _intersection = new Set();
        for (const elem of setB) {
            if (setA.has(elem)) {
                _intersection.add(elem);
            }
        }
        return _intersection;
    }
    const aBigrams = bigrams(a);
    const bBigrams = bigrams(b);
    const intersect = intersection(aBigrams, bBigrams);
    return (2 * intersect.size) / (aBigrams.size + bBigrams.size);
}

export const calculateSimilarityScore = (productName, searchName) => {
    return diceCoefficient(productName.toLowerCase(), searchName.toLowerCase());
}

export const filterProductsByKeywords = (products, keyword) => {
    return products.filter(product => product.name.toLowerCase().includes(keyword));
}