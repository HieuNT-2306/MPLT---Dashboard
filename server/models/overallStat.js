import mongoose from 'mongoose';

const OverallStatSchema = mongoose.Schema({
    totalCustomer: Number,
    yearlySalesTotal: Number,
    yearlyTotalSoldUnit: Number,
    year: Number,
    monthlyData: [{
        month: {
            type: Number,
            required: true
        },
        salesTotal: {
            type: Number,
            required: true
        },
        salesUnits: {
            type: Number,
            required: true
        }
    }],
    dailyData: [{
        day: {
            type: String,
        },
        salesTotal: {
            type: Number,
            required: true
        },
        salesUnits: {
            type: Number,
            required: true
        }
    }],
    salesByCategory:{
        type: Map,
        of: Number
    },
}, { timestamps: true });

const OverallStat = mongoose.model('OverallStat', OverallStatSchema);  // User is the name of the model
export default OverallStat;