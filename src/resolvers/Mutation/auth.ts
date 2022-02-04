
import { Post, Prisma } from '@prisma/client'
import { Context } from '../../index'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import { JWT_SIGNATURE } from '../../keys'

interface SignupArgs {
    credentials: {
        email: string
        password: string
    }
    name: string
    bio: string
}

interface SigninArgs {
    credentials: {
        email: string
        password: string
    }
}


interface UserPayload {
    userErrors: {
        message: string
    }[]
    token: string | null
}

export const authResolvers = {
    signup: async (_: any, { credentials, name, bio }: SignupArgs, { prisma }: Context): Promise<UserPayload> => {

        const { email, password } = credentials
        const isEmail = validator.isEmail(email)

        if (!isEmail) {
            return {
                userErrors: [{
                    message: 'Please provide valid email'
                }],
                token: null
            }
        }

        const isValidPassword = validator.isLength(password, {
            min: 5
        })

        if (!isValidPassword) {
            return {
                userErrors: [{
                    message: 'Password length must be at least 5'
                }],
                token: null
            }
        }


        if (!name || !bio) {
            return {
                userErrors: [{
                    message: 'Please provide name or bio'
                }],
                token: null
            }
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })

        await prisma.profile.create({
            data: {
                bio,
                userId: user.id
            }
        })

        return {
            userErrors: [],
            token: JWT.sign({
                userId: user.id
            }, JWT_SIGNATURE, {
                expiresIn: 36000
            })
        }

    },
    signin: async (_: any, { credentials }: SigninArgs, { prisma }: Context): Promise<UserPayload> => {


        const { email, password } = credentials

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return {
                userErrors: [{
                    message: 'Invalid Credentials'
                }],
                token: null
            }
        }

        const isMatch = await bcrypt.compare(password, user.password)


        if (!isMatch) {
            return {
                userErrors: [{
                    message: 'Invalid Credentials'
                }],
                token: null
            }
        }

        return {
            userErrors: [],
            token: JWT.sign({
                userId: user.id
            }, JWT_SIGNATURE, {
                expiresIn: 36000
            })
        }



    }
}