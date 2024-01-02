import Brand from "../models/brand.js";
import Category from "../models/category.js";

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

        // Update dailyData
        if (dailyData) {
            const day = new Date(dailyData.day);
            const index = category.dailyData.findIndex((data) =>
                data.day.getFullYear() === day.getFullYear() &&
                data.day.getMonth() === day.getMonth() &&
                data.day.getDate() === day.getDate()
            );
            if (index !== -1) {
                category.dailyData[index].salesTotal += dailyData.salesTotal;
                category.dailyData[index].salesUnits += dailyData.salesUnits;
            } else {
                category.dailyData.push(dailyData);
            }

            // Update monthlyData
            const monthIndex = category.monthlyData.findIndex(data => data.year === day.getFullYear() && data.month === day.getMonth());
            if (monthIndex !== -1) {
                category.monthlyData[monthIndex].salesTotal += dailyData.salesTotal;
                category.monthlyData[monthIndex].salesUnits += dailyData.salesUnits;
            } else {
                category.monthlyData.push({
                    year: day.getFullYear(),
                    month: day.getMonth(),
                    salesTotal: dailyData.salesTotal,
                    salesUnits: dailyData.salesUnits
                });
            }
        }

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
        if (dailyData) {
            const day = new Date(dailyData.day);
            const index = brand.dailyData.findIndex((data) =>
                data.day.getFullYear() === day.getFullYear() &&
                data.day.getMonth() === day.getMonth() &&
                data.day.getDate() === day.getDate()
            );
            if (index !== -1) {
                brand.dailyData[index].salesTotal += dailyData.salesTotal;
                brand.dailyData[index].salesUnits += dailyData.salesUnits;
            } else {
                brand.dailyData.push(dailyData);
            }

            // Update monthlyData
            const monthIndex = brand.monthlyData.findIndex(data => data.year === day.getFullYear() && data.month === day.getMonth());
            if (monthIndex !== -1) {
                brand.monthlyData[monthIndex].salesTotal += dailyData.salesTotal;
                brand.monthlyData[monthIndex].salesUnits += dailyData.salesUnits;
            } else {
                brand.monthlyData.push({
                    year: day.getFullYear(),
                    month: day.getMonth(),
                    salesTotal: dailyData.salesTotal,
                    salesUnits: dailyData.salesUnits
                });
            }
        }
        const updatedBrand = await brand.save();

        res.json(updatedBrand);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}