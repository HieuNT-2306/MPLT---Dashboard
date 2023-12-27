import mongoose from 'mongoose';

const OverallStatSchema = mongoose.Schema({
    totalCustomer: Number,
    yearlySalesTotal: Number,
    yearlyTotalSoldUnit: Number,
    year: Number,
    monthlyData: [{
        month: {
            type: Number,
        },
        salesTotal: {
            type: Number,
        },
        salesUnits: {
            type: Number,
        }
    }],
    dailyData: [{
        day: {
            type: Date,
        },
        salesTotal: {
            type: Number,
        },
        salesUnits: {
            type: Number,
        }
    }],
    salesByCategory:{
        type: Map,
        of: Number
    },
    unitsByCategory:{
        type: Map,
        of: Number
    },
}, { timestamps: true });

const OverallStat = mongoose.model('OverallStat', OverallStatSchema);  // User is the name of the model
export default OverallStat; 