const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({ node: 'http://localhost:9200' });

module.exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      // Truy vấn rỗng, trả về lỗi hoặc thông báo cho người dùng
      return res.status(400).json({ error: 'Empty query' });
    }
    // Tìm kiếm trong chỉ mục Elasticsearch chung
    const { body } = await esClient.search({
      index: ['datn', 'datn-user'],
      body: {
        query: {
          match_all: {},
        },
        size: 0,
      },
    });

    if (!body || !body.hits || !body.hits.hits || body.hits.hits.length === 0) {
      console.log('Không có kết quả phù hợp.');
      return res.status(404).json({ message: 'No matching data found.' });
    }

    res.json(body.hits.hits.map((hit) => hit._source));
  } catch (err) {
    console.error('Error searching Elasticsearch:', err);
    res.status(500).json({ message: 'An error occurred' });
  }
};
