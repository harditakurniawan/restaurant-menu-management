export const ResponseMessageTransformer = {
    restaurant: {
        success: {
            create: 'Restaurant created successfully',
            update: 'Restaurant updated successfully',
            delete: 'Restaurant deleted successfully',
        },
        error: {
            not_found: 'Restaurant not found',
            forbidden: 'You are not authorized to perform this action',
        }
    }
}