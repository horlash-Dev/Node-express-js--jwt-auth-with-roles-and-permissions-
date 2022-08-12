const { mongoose, Schema } = require("mongoose");

const Permission = new Schema({
    name: {
        type: String, required: true, unique: true, trim: true,
    },
    slug: {
        type: String, unique: true,
    }
}, { timestamps: true })


Permission.pre("save", function (next) {
    this.slug = this.name.toLowerCase().trim().replace(/\s+/g, '.')
    next()
})
Permission.statics.showAll = function () {
    return this.find().lean().exec()
}
module.exports = mongoose.model("Permission", Permission)