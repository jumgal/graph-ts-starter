import { Context } from "..";


interface UserParentType {
    id: number
}


export const User = {
    posts: ({ id }: UserParentType, _: any, { prisma, userInfo }: Context) => {

        const isOwnProfile = id === userInfo?.userId

        if (isOwnProfile) {
            return prisma.post.findMany({
                where: {
                    authorId: id
                },
                orderBy: [
                    {
                        createdAt: 'desc'
                    }
                ]
            })
        } else {
            return prisma.post.findMany({
                where: {
                    authorId: id,
                    published: true
                },
                orderBy: [
                    {
                        createdAt: 'desc'
                    }
                ]
            })
        }


    }
}
