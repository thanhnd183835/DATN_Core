/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API to manage auth.
 * @swagger
 * tags:
 *   name: User
 *   description: API to manage User
 * @swagger
 * tags:
 *   name: Cart
 *   description: API to manage Cart.
 * @swagger
 * tags:
 *   name: Chat
 *   description: API to manage Chat.
 * @swagger
 * tags:
 *   name: Notification
 *   description: API to manage Notification.
 *@swagger
 * tags:
 *   name: Order
 *   description: API to manage Order.
 *@swagger
 * tags:
 *   name: Post
 *   description: API to manage Post.
 *@swagger
 * tags:
 *   name: Search
 *   description: API to manage Search
 *@swagger
 * tags:
 *   name: Transaction
 *   description: API to manage Transaction

 */

/**
 * @swagger
 * /api/users/sign-in:
 *   post:
 *     summary: login tài khoản thường
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/sign-up:
 *   post:
 *     summary: register
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/google:
 *   post:
 *     summary: login google
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/facebook:
 *   post:
 *     summary: login facebook
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/replace-password:
 *   post:
 *     summary: replace password
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/cart/add-cart:
 *   post:
 *     summary: add post to cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/cart/get-list-cart:
 *   get:
 *     summary: list post to cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/cart/update-quantity:
 *   put:
 *     summary: update quantity
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/cart/delete-cart/:id:
 *   delete:
 *     summary: delete post to cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/chat/inbox:
 *   post:
 *     summary: create news message
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/chat/get-list-message/:idReceiver:
 *   get:
 *     summary: get list message
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/chat/get-rooms:
 *   get:
 *     summary: get rooms chat
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/notification/like/:idPost:
 *   post:
 *     summary: noti like post
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/notification/comment/:idPost:
 *   post:
 *     summary: create news message
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/notification/read':
 *   get:
 *     summary: red noti
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/notification/get-all:
 *   get:
 *     summary: get all noti
 *     tags: [Notification]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/order/create-order:
 *   post:
 *     summary: create order
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/order/get-order-for-me:
 *   get:
 *     summary: lấy ra các sản phẩm đã đặt (người mua)
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/order/get-order-placed:
 *   get:
 *     summary: lấy ra các sản phẩm được đặt (người bán)
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/order/agree-item-order:
 *   put:
 *     summary: đồng ý nhận đơn hàng
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/order/refuse-item-order:
 *   put:
 *     summary: từ chối đơn hàng
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/order/order-detail/:id:
 *   get:
 *     summary: chi tiết đơn hàng được đặt
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/create-post:
 *   post:
 *     summary: create post
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 *  @swagger
 * /api/post/delete-post/:idPost:
 *   delete:
 *     summary: delete post
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/like/:idPost:
 *   post:
 *     summary: like post
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/comment/:idPost:
 *   post:
 *     summary: comment post
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/get-post/:id:
 *   post:
 *     summary: chi tiết bài post
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/get-all-post:
 *   get:
 *     summary: get all post
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/get-all-post-with-subdivision/:subdivision:
 *   get:
 *     summary: get all post with subdivision
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/get-post-for-me:
 *   get:
 *     summary: get post for me
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/get-post-for-me/:typeItem:
 *   get:
 *     summary: get post for me with typeItem
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server'
 * @swagger
 * /api/post/get-post-for-friend/:id:
 *   get:
 *     summary: get post for friend
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/get-list-typeItem/:id/:typeItem:
 *   get:
 *     summary: get post for friend with typeItem
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/post/get-list-typeItem/:typeItem:
 *   get:
 *     summary: get post for friend
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/search/elasticsearch:
 *   get:
 *     summary: get post for friend
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/transaction/create_payment_url:
 *   post:
 *     summary: create payment
 *     tags: [Transaction]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: search user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/change-avatar:
 *   post:
 *     summary: change avatar
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server*
 * @swagger
 * /api/users/edit-profile:
 *   post:
 *     summary: edit profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/get-me:
 *   get:
 *     summary: change avatar
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/profile-friend/:id:
 *   get:
 *     summary: profile friend
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/get-all-user:
 *   get:
 *     summary: get all user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 * @swagger
 * /api/users/confirm-sale-point/:id:
 *   post:
 *     summary: xác nhận điểm bán hàng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 *  @swagger
 * /api/users/cancel-sell/:id:
 *   post:
 *     summary: hủy điểm bán hàng
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 *   @swagger
 * /api/users/send-email:
 *   post:
 *     summary: send email
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Lỗi server
 */
