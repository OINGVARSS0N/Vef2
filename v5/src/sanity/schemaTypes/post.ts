// eslint-disable-next-line import/no-anonymous-default-export
export default {
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
      },
      {
        name: 'excerpt',
        title: 'Excerpt',
        type: 'string',
      },
      {
        name: 'content',
        title: 'Content',
        type: 'array',
        of: [{type: 'block'}],
      },
    ],
  }