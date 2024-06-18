import Brand from "../models/brand.js";
import Category from "../models/category.js";
import OverallStat from "../models/overallStat.js";
import Product from "../models/product.js";
import ProductStat from "../models/productStat.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import fs from 'fs';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        const productsStat = await Promise.all(products.map(async (product) => {
            const productStat = await ProductStat.find({ productId: product._id });
            return {
                ...product._doc,
                productStat,
            };
        }));

        res.status(200).json(productsStat);

    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}

export const getCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: "user" }).select("-password");
        res.status(200).json(customers);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}

export const getTransactions = async (req, res) => {
    try {
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
        const generateSort = (sort) => {
            if (!sort) return {};
            const sortParsed = JSON.parse(sort);
            const sortFormatted = {
                [sortParsed.field]: sortParsed.order === "ascend" ? 1 : -1
            };
            return sortFormatted;
        }
        const sortFormatted = Boolean(sort) ? generateSort(sort) : {};
        const transactions = await Transaction.find().populate({
            path: 'userId',
            select: 'email name phonenumber _id'
        }).populate({
            path: 'products.productId',
            select: 'name price _id'
        }).sort(sortFormatted);

        const total = await Transaction.countDocuments({
            name: { $regex: search, $options: "i" }
        });

        res.status(200).json(transactions);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}

export const postProducts = async (req, res) => {
    try {
        const { name, description, price, category, supply, brand } = req.body;
        let imgLink = "./temp/" + req.file.filename;
        const uploadImgResult = await cloudinary.uploader.upload(imgLink, { resource_type: 'image' });
        fs.unlink(imgLink, err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            }
        });
        const priceHistory = [
            {
                price, date: new Date()
            }
        ]
        const newProduct = new Product({
            name, description, price, category, supply, brand, priceHistory,
            img: uploadImgResult.secure_url,
        });
        await newProduct.save();
        const newProductStat = new ProductStat({
            productId: newProduct._id,
            yearlySalesTotal: 0,
            yearlySalesUnits: 0,
            year: new Date().getFullYear(),
            monthlyData: [],
            dailyData: []
        });
        await newProductStat.save();
        res.status(201).json({ message: "Add product succesfully",product: newProduct, productStat: newProductStat });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category, supply } = req.body;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (name) product.name = name;
        if (price) {
            product.priceHistory.push({
                price: price,
                date: new Date(),
            });
            product.price = price;
        }
        if (description) product.description = description;
        if (category) product.category = category;
        if (supply) product.supply = supply;
        if (req.file) {
            let publicId = product.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
            let imgLink = './temp/' + req.file.filename;
            const uploadImgResult = await cloudinary.uploader.upload(imgLink, { resource_type: 'image' });
            fs.unlink(imgLink, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: err.message });
                }
            });
            product.img = uploadImgResult.secure_url;
        }
        
        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postCustomer = async (req, res) => {
    try {
        const { _id, name, email, phonenumber, address, password, purchasevalue, purchaseamount } = req.body;
        console.log(req.body)
        if (!_id) {
            console.log("new user");
            const newUser = new User({
                name, email, phonenumber, password, address, purchasevalue, purchaseamount,
                role: "user",
            });
            await newUser.save();
            res.status(201).json({ newUser });
        }
        else {
            console.log("update user");
            const user = await User.findById(_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (name) user.name = name;
            if (email) user.email = email;
            if (phonenumber) user.phonenumber = phonenumber;
            if (address) user.address = address;
            if (purchasevalue) user.purchasevalue = purchasevalue;
            if (purchaseamount) user.purchaseamount = purchaseamount;

            const updatedUser = await user.save();
            return res.json({ updatedUser });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
};

export const postTransaction = async (req, res) => {
    try {
        const { userId, products } = req.body;

        // Fetch product details
        const productIds = products.map((product) => product.productId); // Extract product IDs
        const productDocs = await Promise.all(
            productIds.map((productId) => Product.findById(productId))
        );

        // Validate product existence
        if (productDocs.some((doc) => !doc)) {
            return res.status(400).json({ message: "Invalid product ID(s)" });
        }

        let totalCost = 0;
        let numberOfProducts = 0;

        for (let i = 0; i < products.length; i++) {
            const productDoc = productDocs[i];
            const quantity = products[i].quantity; // Get quantity from request body
            productDocs[i] = {
                ...productDoc._doc,
                quantity,
            }
            totalCost += productDoc.price * quantity;
            numberOfProducts += quantity;
        }

        const newTransaction = new Transaction({
            userId,
            products,
            cost: totalCost,
            numberOfProducts,
        });
        const day = new Date();

        // Update user purchasevalue and purchaseamount

        const user = await User.findByIdAndUpdate(userId, {
            $inc: {
                purchasevalue: totalCost,
                purchaseamount: numberOfProducts,
            },
        }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        // Update product supply
        for (const productDoc of productDocs) {
            const category = await Category.findById(productDoc.category);
            if (!category) {
                throw new Error(`Category not found: ${productDoc.category}`);
            }
            const brand = await Brand.findById(productDoc.brand);
            if (!brand) {
                throw new Error(`Brand not found: ${productDoc.brand}`);
            }

            //Category
            const existingDailyData = category.dailyData.find((data) =>
                data.day &&
                data.day.getFullYear() === day.getFullYear() &&
                data.day.getMonth() === day.getMonth() &&
                data.day.getDate() === day.getDate()
            );
            if (existingDailyData) {
                existingDailyData.salesTotal += productDoc.price * productDoc.quantity;
                existingDailyData.salesUnits += productDoc.quantity;
                existingDailyData.transactionNumbers += 1; // Update transactionNumbers
            } else {
                category.dailyData.push({
                    day,
                    salesTotal: productDoc.price * productDoc.quantity,
                    salesUnits: productDoc.quantity,
                    transactionNumbers: 1, // Initialize transactionNumbers
                });
            }

            // Update monthlyData
            const monthIndex = category.monthlyData.findIndex((data) =>
                data.year === day.getFullYear() && data.month === day.getMonth()
            );
            if (monthIndex !== -1) {
                category.monthlyData[monthIndex].salesTotal += productDoc.price * productDoc.quantity;
                category.monthlyData[monthIndex].salesUnits += productDoc.quantity;
                category.monthlyData[monthIndex].transactionNumbers += 1;
            } else {
                category.monthlyData.push({
                    year: day.getFullYear(),
                    month: day.getMonth(),
                    salesTotal: productDoc.price * productDoc.quantity,
                    salesUnits: productDoc.quantity,
                    transactionNumbers: 1,
                });
            }
            await category.save();
            // Brand

            const existingDailyDataBrand = brand.dailyData.find((data) =>
                data.day &&
                data.day.getFullYear() === day.getFullYear() &&
                data.day.getMonth() === day.getMonth() &&
                data.day.getDate() === day.getDate()
            );
            if (existingDailyDataBrand) {
                existingDailyDataBrand.salesTotal += productDoc.price * productDoc.quantity;
                existingDailyDataBrand.salesUnits += productDoc.quantity;
                existingDailyDataBrand.transactionNumbers += 1; // Update transactionNumbers
            } else {
                brand.dailyData.push({
                    day,
                    salesTotal: productDoc.price * productDoc.quantity,
                    salesUnits: productDoc.quantity,
                    transactionNumbers: 1, // Initialize transactionNumbers
                });
            }

            // Update monthlyData
            const monthIndexBrand = brand.monthlyData.findIndex((data) =>
                data.year === day.getFullYear() && data.month === day.getMonth()
            );
            if (monthIndexBrand !== -1) {
                brand.monthlyData[monthIndexBrand].salesTotal += productDoc.price * productDoc.quantity;
                brand.monthlyData[monthIndexBrand].salesUnits += productDoc.quantity;
                brand.monthlyData[monthIndexBrand].transactionNumbers += 1;
            } else {
                brand.monthlyData.push({
                    year: day.getFullYear(),
                    month: day.getMonth(),
                    salesTotal: productDoc.price * productDoc.quantity,
                    salesUnits: productDoc.quantity,
                    transactionNumbers: 1,
                });
            }

            await brand.save();

            const productStat = await ProductStat.findOneAndUpdate(
                { productId: productDoc._id, year: day.getFullYear() },
                {
                    $inc: {
                        yearlySalesTotal: productDoc.price * productDoc.quantity,
                        yearlySalesUnits: productDoc.quantity,
                    },
                },
                { new: true }
            );

            if (!productStat) {
                productStat = new ProductStat({
                    productId: productDoc._id,
                    yearlySalesTotal: productDoc.price * productDoc.quantity,
                    yearlySalesUnits: productDoc.quantity,
                    year: day.getFullYear(),
                });
                await productStat.save();
            }
        }
        //update the overallstat
        let overallStat = await OverallStat.findOne({ year: day.getFullYear() });
        if (!overallStat) {
            overallStat = new OverallStat({
                year: day.getFullYear(),
                monthlyData: [],
                dailyData: [],
            })
        }
        const existingDailyDataOverall = overallStat.dailyData.find((data) => data.day &&
            data.day.getFullYear() === day.getFullYear() &&
            data.day.getMonth() === day.getMonth() &&
            data.day.getDate() === day.getDate()
        );
        if (existingDailyDataOverall) {
            existingDailyDataOverall.salesTotal += totalCost;
            existingDailyDataOverall.salesUnits += numberOfProducts;
            existingDailyDataOverall.transactionNumbers += 1; // Update transactionNumbers
        } else {
            overallStat.dailyData.push({
                day,
                salesTotal: totalCost,
                salesUnits: numberOfProducts,
                transactionNumbers: 1, // Initialize transactionNumbers
            });
        }

        const existingMonthlyDataOverall = overallStat.monthlyData.find((data) =>
            data.month === day.getMonth()
        );
        if (existingMonthlyDataOverall) {
            existingMonthlyDataOverall.salesTotal += totalCost;
            existingMonthlyDataOverall.salesUnits += numberOfProducts;
            existingMonthlyDataOverall.transactionNumbers += 1;
        }
        else {
            overallStat.monthlyData.push({
                year: day.getFullYear(),
                month: day.getMonth(),
                salesTotal: totalCost,
                salesUnits: numberOfProducts,
                transactionNumbers: 1,
            });
        }
        await overallStat.save();


        await newTransaction.save();
        res.status(201).json({ newTransaction, productDocs });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;

        // 1. Delete Transaction
        const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const { userId, products } = deletedTransaction;

        // 2. Update User
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { purchasevalue: -deletedTransaction.cost, purchaseamount: -deletedTransaction.numberOfProducts } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Update Product Supply and Statistics
        for (const productDoc of products) {
            const product = await Product.findById(productDoc.productId);
            if (!product) {
                console.warn(`Product not found: ${productDoc.productId}`);
                continue;
            }
            product.quantity -= productDoc.quantity;
            await product.save();

            const productStat = await ProductStat.findOneAndUpdate(
                { productId: productDoc._id, year: deletedTransaction.day.getFullYear() },
                { $inc: { yearlySalesTotal: -productDoc.price * productDoc.quantity, yearlySalesUnits: -productDoc.quantity } },
                { new: true }
            );
            if (!productStat) {
                console.warn(`ProductStat not found for product ${productDoc.productId} and year ${deletedTransaction.day.getFullYear()}`);
            }
        }

        // 4. Update Category and Brand Daily/Monthly Data
        for (const productDoc of products) {
            const category = await Category.findById(productDoc.category);
            if (!category) {
                console.warn(`Category not found: ${productDoc.category}`);
                continue;
            }

            const brand = await Brand.findById(productDoc.brand);
            if (!brand) {
                console.warn(`Brand not found: ${productDoc.brand}`);
                continue;
            }

            const transactionDate = deletedTransaction.day;

            // Update Category Daily Data
            const categoryDailyDataIndex = category.dailyData.findIndex(
                (data) => data.day &&
                    data.day.getFullYear() === transactionDate.getFullYear() &&
                    data.day.getMonth() === transactionDate.getMonth() &&
                    data.day.getDate() === transactionDate.getDate()
            );
            if (categoryDailyDataIndex !== -1) {
                category.dailyData[categoryDailyDataIndex].salesTotal -= productDoc.price * productDoc.quantity;
                category.dailyData[categoryDailyDataIndex].salesUnits -= productDoc.quantity;
                category.dailyData[categoryDailyDataIndex].transactionNumbers -= 1;
            } else {
                console.warn(`Daily data for category ${productDoc.category} and date ${transactionDate} not found`);
            }

            // Update Category Monthly Data
            const categoryMonthlyDataIndex = category.monthlyData.findIndex(
                (data) => data.year === transactionDate.getFullYear() && data.month === transactionDate.getMonth()
            );
            if (categoryMonthlyDataIndex !== -1) {
                category.monthlyData[categoryMonthlyDataIndex].salesTotal -= productDoc.price * productDoc.quantity;
                category.monthlyData[categoryMonthlyDataIndex].salesUnits -= productDoc.quantity;
                category.monthlyData[categoryMonthlyDataIndex].transactionNumbers -= 1;
            } else {
                console.warn(`Monthly data for category ${productDoc.category} and month ${transactionDate.getMonth()} not found`);
            }
            await category.save();

            // Update Brand Daily Data (similar to category)
            const brandDailyDataIndex = brand.dailyData.findIndex(
                (data) => data.day &&
                    data.day.getFullYear() === transactionDate.getFullYear() &&
                    data.day.getMonth() === transactionDate.getMonth() &&
                    data.day.getDate() === transactionDate.getDate()
            );
            if (brandDailyDataIndex !== -1) {
                brand.dailyData[brandDailyDataIndex].salesTotal -= productDoc.price * productDoc.quantity;
                brand.dailyData[brandDailyDataIndex].salesUnits -= productDoc.quantity;
                brand.dailyData[brandDailyDataIndex].transactionNumbers -= 1;
            } else {
                console.warn(`Daily data for brand ${productDoc.brand} and date ${transactionDate} not found`);
            }

            const brandMonthlyDataIndex = brand.monthlyData.findIndex(
                (data) => data.year === transactionDate.getFullYear() && data.month === transactionDate.getMonth()
            );
            if (brandMonthlyDataIndex !== -1) {
                brand.monthlyData[brandMonthlyDataIndex].salesTotal -= productDoc.price * productDoc.quantity;
                brand.monthlyData[brandMonthlyDataIndex].salesUnits -= productDoc.quantity;
                brand.monthlyData[brandMonthlyDataIndex].transactionNumbers -= 1;
            }
            else {
                console.warn(`Monthly data for brand ${productDoc.brand} and month ${transactionDate.getMonth()} not found`);
            }
            await brand.save();
            
            // Update OverallStat
            const overallStat = await OverallStat.findOne({ year: transactionDate.getFullYear() });
            if (!overallStat) {
                console.warn(`OverallStat not found for year ${transactionDate.getFullYear()}`);
                continue;
            }
            
            // Update OverallStat Daily Data
            const overallDailyDataIndex = overallStat.dailyData.findIndex(
                (data) => data.day &&
                    data.day.getFullYear() === transactionDate.getFullYear() &&
                    data.day.getMonth() === transactionDate.getMonth() &&
                    data.day.getDate() === transactionDate.getDate()
            );
            if (overallDailyDataIndex !== -1) {
                overallStat.dailyData[overallDailyDataIndex].salesTotal -= productDoc.price * productDoc.quantity;
                overallStat.dailyData[overallDailyDataIndex].salesUnits -= productDoc.quantity;
                overallStat.dailyData[overallDailyDataIndex].transactionNumbers -= 1;
            } else {
                console.warn(`Daily data for overallStat and date ${transactionDate} not found`);
            }

            // Update OverallStat Monthly Data
            const overallMonthlyDataIndex = overallStat.monthlyData.findIndex(
                (data) => data.year === transactionDate.getFullYear() && data.month === transactionDate.getMonth()
            );
            if (overallMonthlyDataIndex !== -1) {
                overallStat.monthlyData[overallMonthlyDataIndex].salesTotal -= productDoc.price * productDoc.quantity;
                overallStat.monthlyData[overallMonthlyDataIndex].salesUnits -= productDoc.quantity;
                overallStat.monthlyData[overallMonthlyDataIndex].transactionNumbers -= 1;
            } else {
                console.warn(`Monthly data for overallStat and month ${transactionDate.getMonth()} not found`);
            }
            await overallStat.save();
        }
        res.json({ message: "Transaction deleted successfully", deletedTransaction });
        
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        const productStat = await ProductStat.findOne({ productId: id });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let publicId = product.img.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        await product.deleteOne({ _id: id });
        await productStat.deleteOne({ productId: id });
        res.status(200).json({
            message: 'Product deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteOne({ _id: id });
        res.json({ message: 'User deleted successfully', user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}



/*debug router*/

export const resetDailDataCategory = async (req, res) => {
    try {
        const category = await Category.find();
        category.forEach(async (cat) => {
            cat.dailyData = [];
            cat.monthlyData = [];
            cat.save();
        });
        res.status(200).json(category);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}
export const resetDataBrand = async (req, res) => {
    try {
        const brand = await Brand.find();
        brand.forEach(async (brand) => {
            brand.dailyData = [];
            brand.monthlyData = [];
            brand.save();
        });
        res.status(200).json(brand);
    }
    catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}