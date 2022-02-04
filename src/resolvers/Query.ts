import { Context } from '../index'
import { Post } from '@prisma/client'


export const Query = {
    me: async (_: any, __: any, { prisma, userInfo }: Context) => {

        if (!userInfo) return null

        return prisma.user.findUnique({
            where: {
                id: userInfo.userId
            }
        })
    },
    profile: (_: any, { userId }: { userId: string }, { prisma, userInfo }: Context) => {
        return prisma.profile.findUnique({
            where: {
                userId: Number(userId)
            }
        })
    },
    posts: async (_: any, __: any, { prisma }: Context): Promise<Post[]> => {

        return prisma.post.findMany({
            where: {
                published: true
            },
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        })
    }
}
