
import { Post, Prisma } from '@prisma/client'
import { Context } from '../index'

interface PostArgs {
    post: {
        title?: string,
        content?: string
    }
}


interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const Mutation = {
    postCreate: async (_: any, { post: { title, content } }: PostArgs, { prisma }: Context): Promise<PostPayloadType> => {


        if (!title || !content) {
            return {
                userErrors: [{
                    message: 'Title and Content should be provided'
                }],
                post: null
            }
        }

        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: 1
                }
            })
        }
    },

    postUpdate: async (_: any, { postId, post }: { postId: string, post: PostArgs['post'] }, { prisma }: Context): Promise<PostPayloadType> => {

        const { title, content } = post

        if (!title && !content) {
            return {
                userErrors: [{
                    message: 'Title or Content should be provided'
                }],
                post: null
            }
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!existingPost) {
            return {
                userErrors: [{
                    message: 'There is any post with provided id'
                }],
                post: null
            }
        }

        let payloadToUpdate = {
            title,
            content
        }

        if (!title) delete payloadToUpdate.title
        if (!content) delete payloadToUpdate.content

        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdate
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },

    postDelete: async (_: any, { postId }: { postId: string }, { prisma }: Context): Promise<PostPayloadType> => {

        const postToDelete = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })


        if (!postToDelete) {
            return {
                userErrors: [{
                    message: 'There is not any post with provided id'
                }],
                post: null
            }
        }

        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post: postToDelete
        }
    }

}