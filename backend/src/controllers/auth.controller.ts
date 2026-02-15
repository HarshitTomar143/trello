import {Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../config/prisma"

// This is used for register 
export const register = async(req: Request, res: Response) => {
    try{
        const{name, email, password} = req.body

        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user= await prisma.user.create({
            data : {
                name,
                email,
                password: hashedPassword
            }
        })

        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET as string,
            {expiresIn: "7d"}
        )

        return res.status(201).json({
            message: "User registered successfully",
            token
        })
    } catch(error){
        console.error(error)
        return res.status(500).json({message : "Internal server error"})
    }
}

// This is used for login
export const login = async(req: Request, res: Response) => {
    try{
        const{email, password} = req.body

        if(!email || !password){
            return res.status(400).json({message: "Email and password required" })
        }

        const user = await prisma.user.findUnique({
            where: {email}
        })

        if(!email){
            return res.status(400).json({message: "Invalid Email"})
        }

        if(!password){
            return res.status(400).json({message: "Invalid password"})
        }

        if(!user){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET as string,
            {expiresIn: "7d"}
        )

        return res.status(200).json({
            message: "Sign in successful",
            token
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message: "Interval Server Error"})
    }
}