const esClient = require('../ElasticSearch/elasticsearch');

module.exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      // Truy vấn rỗng, trả về lỗi hoặc thông báo cho người dùng
      return res.status(400).json({ error: 'Empty query' });
    }
    // Tìm kiếm trong chỉ mục Elasticsearch chung
    const body = await esClient.search({
      index: ['datn', 'datn-user'],
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['*', 'userName'], // Tìm kiếm trong tất cả các trường
          },
        },
      },
    });

    res.json(body?.hits?.hits.map((hit) => hit._source));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
};
