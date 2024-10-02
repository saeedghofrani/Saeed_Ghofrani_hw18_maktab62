/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Article = require('./article.model');
const Comment = require('./comment.model');

// mongoose plugin dependencie
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required']
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        minlength: [8, 'invalid password'],
        // validate: {
        //     // validator: function (v) {
        //     //     const reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        //     //     return reg.test(v);
        //     // },
        //     message: '{VALUE} is not a valid password!'
        // },
        select: false,
    },
    username: {
        type: String,
        trim: true,
        minlength: [5, 'invalid phone'],
        required: [true, 'Username is required'],
        unique: true,
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'none'],
            message: '{VALUE} is not supported'
        },
        default: 'none',
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return validator.isMobilePhone(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    email: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return validator.isEmail(v);
            },
            message: '{VALUE} is not a valid email!'
        },
        default: 'example@gmail.com'
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Article'
    }],
    avatar: {
        type: String,
        default: 'profileAvatar.jpg'
    }
}, { timestamps: true });

//hashing password hook
UserSchema.pre('save', async function (next) {
    const user = this._doc;
    if (this.isNew || this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        return next();
    }
});

UserSchema.pre(/^find/, function async(next) {
    this.find({ status: { $ne: "inactive" } });
    next();
});

UserSchema.pre("findOneAndDelete", async function (next) {

    await Article.deleteMany({ author: this._conditions._id });
    await Comment.deleteMany({ username: this._conditions._id });
    console.log(this._conditions._id);
    // console.log(allUserArticle);

    // for (let i = 0; i < allUserArticle.length; i++) {
    //     await Comment.deleteMany({ "postId": allUserArticle[i]._id });
    //     deletePicture("../public/images/article", allUserArticle[i].image);
    // }

    // allUserArticle.map((value, index, array) => {
    //     Comment.deleteMany({ "postId": value._id });
    //     deletePicture("../public/images/article", value.image);
    // });

    next();

});

module.exports = mongoose.model('User', UserSchema);