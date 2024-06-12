export default {
    dataSchema: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                label: 'Voting Title',
                required: true
            },
            backgroundImage: {
                type: 'string',
                label: 'Voting Background Image'
            },
            buttons: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'string',
                            required: true
                        },
                        label: {
                            type: 'string',
                            required: true
                        }
                    }
                }
            },
            fontColor: {
                type: 'string',
                format: 'color'
            }
        }
    },
    uiSchema: {
        type: 'VerticalLayout',
        elements: [
            {
                type: 'HorizontalLayout',
                elements: [
                    {
                        type: 'Categorization',
                        elements: [
                            {
                                type: 'Category',
                                label: 'General',
                                elements: [
                                    {
                                        type: 'HorizontalLayout',
                                        elements: [
                                            {
                                                type: 'Control',
                                                scope: '#/properties/title'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'HorizontalLayout',
                                        elements: [
                                            {
                                                type: 'Control',
                                                scope: '#/properties/backgroundImage'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'HorizontalLayout',
                                        elements: [
                                            {
                                                type: 'Control',
                                                scope: '#/properties/fontColor'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'Category',
                                label: 'Buttons',
                                elements: [
                                    {
                                        type: 'Control',
                                        scope: '#/properties/buttons',
                                        options: {
                                            detail: {
                                                type: 'VerticalLayout'
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}