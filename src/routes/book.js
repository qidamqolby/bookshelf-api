module.exports = [
  {
    method: 'GET',
    path: '/books',
    handler: require('../handlers/book').getBooks,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: require('../handlers/book').getBookById,
  },
  {
    method: 'POST',
    path: '/books',
    handler: require('../handlers/book').postBook,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: require('../handlers/book').putBookById,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: require('../handlers/book').deleteBookById,
  },
];
