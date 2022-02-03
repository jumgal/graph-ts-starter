import { Context } from '../index'
import { Post } from '@prisma/client'


export const Query = {
    hello: () => 'Hello thereeeeeee',
    posts: async (_: any, __: any, { prisma }: Context): Promise<Post[]> => {

        return prisma.post.findMany({
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        })
    }
}
