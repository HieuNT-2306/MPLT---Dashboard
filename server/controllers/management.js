import Brand from "../models/brand.js";
import Category from "../models/category.js";
import Product from "../models/product.js";

export const postCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new Category({
            name, monthlyData: [], dailyData: []
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, dailyData } = req.body;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (name) category.name = name;
        // Debug
        // Update dailyData 
        // if (dailyData) {
        //     const day = new Date(dailyData.day);
        //     const index = category.dailyData.findIndex((data) =>
        //         data.day.getFullYear() === day.getFullYear() &&
        //         data.day.getMonth() === day.getMonth() &&
        //         data.day.getDate() === day.getDate()
        //     );
        //     if (index !== -1) {
        //         category.dailyData[index].salesTotal += dailyData.salesTotal;
        //         category.dailyData[index].salesUnits += dailyData.salesUnits;
        //     } else {
        //         category.dailyData.push(dailyData);
        //     }

        //     // Update monthlyData
        //     const monthIndex = category.monthlyData.findIndex(data => data.year === day.getFullYear() && data.month === day.getMonth());
        //     if (monthIndex !== -1) {
        //         category.monthlyData[monthIndex].salesTotal += dailyData.salesTotal;
        //         category.monthlyData[monthIndex].salesUnits += dailyData.salesUnits;
        //     } else {
        //         category.monthlyData.push({
        //             year: day.getFullYear(),
        //             month: day.getMonth(),
        //             salesTotal: dailyData.salesTotal,
        //             salesUnits: dailyData.salesUnits
        //         });
        //     }
        // }
        // End debug
        const updatedCategory = await category.save();

        res.json(updatedCategory);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const postBrand = async (req, res) => {
    try {
        const { name } = req.body;
        const newBrand = new Brand({
            name, monthlyData: [], dailyData: []
        });
        await newBrand.save();
        res.status(201).json(newBrand);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, dailyData } = req.body;

        const brand = await Brand.findById(id);

        if (!brand) {
            return res.status(404).json({ message: 'Category not found' });
        }

        if (name) brand.name = name;

        // Debug
        // if (dailyData) {
        //     const day = new Date(dailyData.day);
        //     const index = brand.dailyData.findIndex((data) =>
        //         data.day.getFullYear() === day.getFullYear() &&
        //         data.day.getMonth() === day.getMonth() &&
        //         data.day.getDate() === day.getDate()
        //     );
        //     if (index !== -1) {
        //         brand.dailyData[index].salesTotal += dailyData.salesTotal;
        //         brand.dailyData[index].salesUnits += dailyData.salesUnits;
        //     } else {
        //         brand.dailyData.push(dailyData);
        //     }

        //     // Update monthlyData
        //     const monthIndex = brand.monthlyData.findIndex(data => data.year === day.getFullYear() && data.month === day.getMonth());
        //     if (monthIndex !== -1) {
        //         brand.monthlyData[monthIndex].salesTotal += dailyData.salesTotal;
        //         brand.monthlyData[monthIndex].salesUnits += dailyData.salesUnits;
        //     } else {
        //         brand.monthlyData.push({
        //             year: day.getFullYear(),
        //             month: day.getMonth(),
        //             salesTotal: dailyData.salesTotal,
        //             salesUnits: dailyData.salesUnits
        //         });
        //     }
        // }
        // End debug
        
        const updatedBrand = await brand.save();

        res.json(updatedBrand);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
};

export const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Error: Category not found' });
        }
        const products = await Product.find({ category: category.id });
        if (products.length > 0) {
            return res.status(404).json({
                message: 'Error: Category is not empty',
                length: products.length,
                listProducts: products
            });
        }
        await Category.deleteOne({ _id: id });
        res.json({
            message: 'Category removed',
            category: category
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findById(id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        const products = await Product.find({ brand: brand.id });
        if (products.length > 0) {
            return res.status(404).json({
                message: 'Brand is not empty',
                length: products.length,
                listProducts: products
            });
        }
        await brand.deleteOne({ _id: id });
        res.json({
            message: 'Brand removed',
            brand: brand
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
