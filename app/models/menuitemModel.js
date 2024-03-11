const mongoose = require('mongoose');

const menuitemSchema = mongoose.Schema({
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    fooditemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    fooditemName: {
        type: String,
        required: true,
    },
    fooditemImage: {
        type: String,
        required: true,
    },
    fooditemPrice: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdTs: {
        type: Date,
        default: new Date(),
    },
    updatedTs: {
        type: Date,
        default: new Date(),
    }
});

const MenuitemModel = mongoose.model('MenuitemModel', menuitemSchema);

module.exports = MenuitemModel;