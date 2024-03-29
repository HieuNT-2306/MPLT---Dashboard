import User from "../models/user.js";
import OverallStat from "../models/overallStat.js";
import Transaction from "../models/transaction.js";


export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}
export const getDashboardStats = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const currentDay = new Date();

        const transactions = await Transaction.find().limit(10).sort({ createdAt: -1 }).populate({
            path: 'userId',
            select: 'email name phonenumber -_id'
        });

        const overallStat = await OverallStat.findOne({ year: 2023 });

        const {
            totalCustomer,
            yearlySalesTotal,
            yearlyTotalSoldUnit,
            salesByCategory,
            unitsByCategory
        } = overallStat;

        const thisMonthData = overallStat.monthlyData.find((data) => data.month === currentMonth);

        const todayData = overallStat.dailyData.find((data) =>
            data.day.getFullYear() === currentDay.getFullYear() &&
            data.day.getMonth() === currentDay.getMonth() &&
            data.day.getDate() === currentDay.getDate()
        ) || {
            day: new Date(),
            salesTotal: 0,
            salesUnits: 0
        };


        res.status(200).json({
            totalCustomer,
            yearlySalesTotal,
            transactions,
            monthlyData: overallStat.monthlyData,
            yearlyTotalSoldUnit,
            thisMonthData,
            todayData,
            salesByCategory,
            unitsByCategory
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error.message,
        });
    }
}
