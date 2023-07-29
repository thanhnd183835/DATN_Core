const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({ node: 'http://localhost:9200' });

module.exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      // Truy vấn rỗng, trả về lỗi hoặc thông báo cho người dùng
      return res.status(400).json({ error: 'Empty query' });
    }

    const { body } = await esClient.search({
      index: ['datn', 'datn-user'],
      body: {
        query: {
          query_string: {
            query: query,
            fields: ['name', 'description', 'userName'],
            default_operator: 'AND',
          },
        },
      },
    });

    res.json(body.hits.hits.map((hit) => hit._source));
  } catch (err) {
    console.error('Error searching Elasticsearch:', err);
    res.status(500).json({ message: 'An error occurred' });
  }
};
