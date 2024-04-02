const responseCheckData = (list) => {
  const message = [];
  for (let i = 0; i < list.length; i++) {
    switch (list[i]) {
      case 'name':
        message.push('Mohon isi nama buku');
        break;

      case 'year':
        message.push('Mohon isi tahun buku');
        break;

      case 'author':
        message.push('Mohon isi penulis buku');
        break;

      case 'summary':
        message.push('Mohon isi ringkasan buku');
        break;

      case 'publisher':
        message.push('Mohon isi penerbit buku');
        break;

      default:
        break;
    }
  }
  return message.join(', ');
};

module.exports = responseCheckData;
