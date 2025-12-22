import express from "express";
import UserModel from "../modals/userModel.js";
import expressAsyncHandler from "express-async-handler";
import generateToken from "../Config/generateToken.js";

export const registerController = expressAsyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    //check for all fields
    if (!name || !email || !password) {
        console.log("Register: Missing fields", req.body);
        return res.status(400).json({ message: "All fields are required" });
    }

    //pre-existing user
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        console.log("Register: Email exists", email);
        return res.status(400).json({ message: "User already exists" });
    }

    //pre-existing user name
    const userNameTaken = await UserModel.findOne({ name });
    if (userNameTaken) {
        console.log("Register: Name taken", name);
        return res.status(400).json({ message: "User name already taken" });
    }

    try {
        const user = await UserModel.create({ name, email, password });
        console.log("Register: User created", user);

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            })
        } else {
            console.log("Register: User creation returned falsy");
            return res.status(400).json({ message: "Registration failed" });
        }
    } catch (err) {
        console.error("Register: Error during creation", err);
        throw err;
    }
});


export const loginController = expressAsyncHandler(async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ name });

    console.log("fetched data", user);
    console.log(await user.matchPassword(password));

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(401);
        throw new Error("Invalid credentials");
    }
});

export const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await UserModel.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});