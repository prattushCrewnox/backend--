import User from '../models/user.models.js'
import asyncHandler from '../utils/ayncHandler.js'
import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'

const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000
}

const generateAuthToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User Not Found")
        const token = await user.generateTokenAuth()
        return token
    }
    catch (error) {
        throw new Error("failed to generate auth token")
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if ([firstName, lastName, email, password].some(fields => fields?.trim() === "")) {
        throw new ApiError(400, "All fields are required.")
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(401, "user already exists!")

    const user = new User({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim()
    })

    await user.save()
    const token = await generateAuthToken(user._id)

    if (!token) {
        res.status(200)
            .cookie('token', token, options)
            .json(new ApiResponse(200, user, "User generated successfully"))
    }

    res.status(200)
        .cookie('token', token, options)
        .json(new ApiResponse(200, { user, token }, "User generated successfully"))

})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, 'All fields are required.')
    const user = await User.findOne({ email })
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid email or password")
    }
    const token = await generateAuthToken(user._id)

    if (!token) {
        throw new ApiError(500, "Failed to generate auth token");
    }
    res.status(200)
        .cookie('accessToken', token, options)
        .json(new ApiResponse(200, { user, token }, "User logged in successfully"));
})

export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token', options)
    res.status(200)
        .json(new ApiResponse(200, null, "User logged out successfully"))
})
