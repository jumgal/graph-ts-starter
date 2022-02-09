import { Context } from "..";
import { userLoader } from "./loaders/userLoader";

interface PostParentType {
    authorId: number
}


export const Post = {
    user: ({ authorId }: PostParentType, _: any, { prisma, userInfo }: Context) => {

        return userLoader.load(authorId)
        // return prisma.user.findUnique({
        //     where: {
        //         id: authorId
        //     }
        // })
    }
}
