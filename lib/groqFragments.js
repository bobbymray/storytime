const lazyLoad = `
  _type == 'figure' => {
    'lazyLoad': asset->{
      metadata {
        dimensions {
          height,
          width
        },
        lqip,
        palette {
          dominant {
            background
          }
        }
      }
    },
    ...
  }
`

export const content = `
  content[]{
    ${lazyLoad},
    _type == 'block' => {
      ...,
      markDefs[]{
        ...,
        _type == 'marginnote' => {
          content[]{
            ...,
            ${lazyLoad}
          }
        }
      }
    },
    ...
  }
`
