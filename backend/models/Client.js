const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const clientSchema = new mongoose.Schema({
company_name: { type: String, required: true },
company_description: String,
industry_type: String,
company_size: String,
registration_number: { type: String, unique: true },
headquarters_country: String,
contact_email: String,
contact_phone: String,
contact_person: {
name: String,
position: String,
email: String,
phone: String
},
department: String,
website_url: String,
logo_url: String,
employee_count: Number,
address: {
street: String,
city: String,
state: String,
country: String,
zip_code: String
},
password: { type: String, required: true, minlength: 6 },
is_verified: { type: Boolean, default: false },
account_status: { type: String, default: "active" }
}, { timestamps: true });

// Hash password before saving
clientSchema.pre("save", async function (next) {
if (!this.isModified("password")) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});

// Match password
clientSchema.methods.matchPassword = async function (enteredPassword) {
return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Client", clientSchema);