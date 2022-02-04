import { Context } from "..";


interface PostParentType {
    authorId: number
}


export const Post = {
    user: ({ authorId }: PostParentType, _: any, { prisma, userInfo }: Context) => {

        return prisma.user.findUnique({
            where: {
                id: authorId
            }
        })
    }
}
