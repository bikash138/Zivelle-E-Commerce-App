import mongoose from 'mongoose'
import User from './User'

const sellerSchema = new mongoose.Schema(
    {
        products:[
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
export default User.discriminator("seller", sellerSchema)