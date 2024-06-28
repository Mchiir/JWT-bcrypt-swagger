const customersSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true,
    },
    phone_number: {
        type: Number,
        required: true,
        unique: true
    }
});

const Customers = mongoose.model("Customers", customersSchema);

export { Customers, customersSchema };