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
    },
    menu_item: {
        success: {
            create: 'Menu item created successfully',
            update: 'Menu item updated successfully',
            delete: 'Menu item deleted successfully',
        },
        error: {
            not_found: 'Menu item not found',
            forbidden: 'You are not authorized to perform this action',
            category_not_found: 'The provided Category ID does not exist.',
            related_resource_not_found: 'Related resource not found.',
            restaurant_not_found: 'The provided Restaurant ID does not exist.',
        }
    }
}