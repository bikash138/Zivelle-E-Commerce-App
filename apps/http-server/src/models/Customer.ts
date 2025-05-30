import mongoose from 'mongoose'
import User from './User';

const customerSchema = new mongoose.Schema(
    {
        purchasedProducts:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        profile:[
            {
                type: mongoose.Schema.Types.ObjectId,
                // required :true,
                ref: "Profile"
            }
        ],
    },
    {timestamps:true}
)
export default User.discriminator('customer', customerSchema);


// const adminSchema = new mongoose.Schema(
//     {
//         firstName: {
//             type:String,
//             required: true,
//             trim: true
//         },
//         lastName: {
//             type:String,
//             required: true,
//             trim: true
//         },
//         email: {
//             type:String,
//             required: true,
//             trim: true
//         },
//         password: {
//             type: String,
//             required: true
//         },
//         confirmPassword: {
//             type: String,
            
//         },
//     },
//     {timestamps:true}
// )
// module.exports = mongoose.model("Admin", adminSchema)


