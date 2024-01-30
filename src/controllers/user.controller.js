
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/User.model"
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    /* 
        1. Get Data
        2. Validate Data
        3. Handle if any error
        4. Check user is exist on not : using username, email
        5. check for image data
        6. upload on cloudinary
        7. check uploaded avatar on cloudinary 
        8. Create User Object - Create Entry in DB
        9. remove password and refresh-token field from response
        10. Check for user creation
        11. return response
    */

    const { fullname, email, username, password } = req.body


    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(
            400,        // statusCode,
            "All fields are reqired",   // message
        )
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exist with given username or email")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImgLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImgLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,

    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(400, "Something went wrong while registering user")
    }

    // ApiResponse()


    res.status(201).json(new ApiResponse(
        200,
        createdUser,
        "User Created successfully"
    ))
})


export default registerUser