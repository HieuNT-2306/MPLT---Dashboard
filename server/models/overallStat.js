import mongoose from 'mongoose';
//Only use for debugging
const OverallStatSchema = mongoose.Schema({
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
        },
        transactionNumbers: {
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
        },
        transactionNumbers: {
            type: Number,
        }
    }],
}, { timestamps: true });

const OverallStat = mongoose.model('OverallStat', OverallStatSchema);
export default OverallStat; 