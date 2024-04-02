/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const {library} = require('../databases');
const isDataEmpty = require('../utils/checkData');
const responseCheckData = require('../utils/responseCheckData');

exports.getBooks = (request, h) => {
  const {name, reading, finished} = request.query;

  let bookList = library;

  // check parameter nama
  if (name && typeof name === 'string') {
    bookList = bookList.filter(
        (book) =>
          book.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  // check parameter reading
  if (reading && (parseInt(reading) === 1 || parseInt(reading) === 0)) {
    const status = parseInt(reading) === 1 ? true : false;
    bookList = bookList.filter(
        (book) =>
          book.reading === status,
    );
  }

  // check parameter finished
  if (finished && (parseInt(finished) === 1 || parseInt(finished) === 0)) {
    const status = parseInt(finished) === 1 ? true : false;
    bookList = bookList.filter(
        (book) =>
          book.finished === status,
    );
  }


  // memberikan response berhasil
  return h.response({
    status: 'success',
    data: {
      books: bookList.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

exports.getBookById = (request, h) => {
  const {id} = request.params;

  let bookList = library;

  // filter data dengan id
  if (id && typeof id === 'string') {
    bookList = bookList.filter(
        (book) =>
          book.id === id,
    );
  }

  if (bookList.length < 1) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  };

  // memberikan response berhasil
  return h.response({
    status: 'success',
    data: {
      book: bookList[0],
    },
  }).code(200);
};

exports.postBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // check total baca apakah melebihi lembar buku
  const checkTotalRead = readPage > pageCount;
  if (checkTotalRead) {
    return h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const data = {
    id: nanoid(16),
    name,
    year: parseInt(year),
    author,
    summary,
    publisher,
    pageCount: parseInt(pageCount),
    readPage: parseInt(readPage),
    finished: readPage === pageCount,
    reading,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // check data ada yg undefined atau tidak
  const checkData = isDataEmpty(data);
  if (checkData.length > 0) {
    // membuat response sesuai dengan kondisi
    const responseText = responseCheckData(checkData);
    return h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${responseText}`,
    }).code(400);
  }

  // masukan ke array
  library.push(data);

  // check apakah berhasil
  const isSuccess = library.filter((book) => book.id === data.id).length > 0;
  if (!isSuccess) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku.',
    }).code(500);
  };

  // memberikan response berhasil
  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: data.id,
    },
  }).code(201);
};

exports.putBookById = (request, h) => {
  const {id} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  let indexBook = 0;

  // filter data dengan id
  if (id && typeof id === 'string') {
    indexBook = library.findIndex(
        (book) =>
          book.id === id,
    );
  }

  if (indexBook < 0) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  // check total baca apakah melebihi lembar buku
  const checkTotalRead = readPage > pageCount;
  if (checkTotalRead) {
    return h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }


  const updatedBook = {
    ...library[indexBook],
    name,
    year: parseInt(year),
    author,
    summary,
    publisher,
    pageCount: parseInt(pageCount),
    readPage: parseInt(readPage),
    finished: readPage === pageCount,
    reading,
    updatedAt: new Date().toISOString(),
  };

  // check data ada yg undefined atau tidak
  const checkData = isDataEmpty(updatedBook);
  if (checkData.length > 0) {
    // membuat response sesuai dengan kondisi
    const responseText = responseCheckData(checkData);
    return h.response({
      status: 'fail',
      message: `Gagal memperbarui buku. ${responseText}`,
    }).code(400);
  }

  library[indexBook] = updatedBook;

  // memberikan response berhasil
  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

exports.deleteBookById = (request, h) => {
  const {id} = request.params;

  let indexBook = 0;

  // filter data dengan id
  if (id && typeof id === 'string') {
    indexBook = library.findIndex(
        (book) =>
          book.id === id,
    );
  }

  if (indexBook < 0) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  library.splice(indexBook, 1);

  // memberikan response berhasil
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

