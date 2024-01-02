import Brand from "../models/brand.js";
import Category from "../models/category.js";
import OverallStat from "../models/overallStat.js";
import Transaction from "../models/transaction.js";

export const getSales = async (req, res) => {
    try {
        const overallStat = await OverallStat.find();
        res.status(200).json(overallStat[0]);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getSalesByYear = async (req, res) => {
    try {
        const { yearParams } = req.params;
        // const yearParam = 2023;
        const overallStat = await OverallStat.find({ year: parseInt(yearParams) });
        const {
            monthlyData,
            dailyData,
        } = overallStat[0];
        const category = await Category.find();

        const salesByCategory = {};
        const unitsByCategory = {};
        let yearlySalesTotal = 0;
        let yearlyTotalSoldUnit = 0;

        for (const cat of category) {
            const matchingMonthlyData = cat.monthlyData.filter((data) => data.year === parseInt(yearParams));

            if (matchingMonthlyData.length > 0) {
                const categorySales = matchingMonthlyData.reduce((total, data) => total + data.salesTotal, 0);
                const categoryUnits = matchingMonthlyData.reduce((total, data) => total + data.salesUnits, 0);
        
                salesByCategory[cat.name] = categorySales;
                unitsByCategory[cat.name] = categoryUnits;
        
                yearlySalesTotal += categorySales; 
                yearlyTotalSoldUnit += categoryUnits;
              }
        }
        const transactions = await Transaction.find({ createdAt: { $gte: new Date(yearParams, 0, 1), $lt: new Date(yearParams + 1, 0, 1) } });
        const totalCustomer = transactions.length;

        res.status(200).json({
            totalCustomer,
            yearlySalesTotal,
            yearlyTotalSoldUnit,
            totalCustomer,
            monthlyData,    
            dailyData,
            salesByCategory,
            unitsByCategory,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};