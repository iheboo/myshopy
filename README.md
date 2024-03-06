# Initialize a new Git repository
git init

# Install Sequelize and Sequelize CLI and save them as dependencies
npm install sequelize sequelize-cli --save

# Initialize Sequelize project (creates necessary files and directories)
npx sequelize-cli init

# Install the MySQL2 package for MySQL database support (check you config.json 'name of your db ')
npm install mysql2

# Generate User model with specified attributes including ENUM type for 'role'
npx sequelize-cli model:generate --name User --attributes "role:ENUM('user', 'admin'),'name:STRING','address:STRING','phone:STRING','email:STRING','password:STRING','img:STRING"

# Generate Review model with attributes for content (TEXT) and like (BOOLEAN)
npx sequelize-cli model:generate --name Review --attributes "content:TEXT",'like:BOOLEAN'

# Generate Category model with attributes name (STRING) and type (STRING)
npx sequelize-cli model:generate --name Category --attributes "name:STRING",'type:STRING'

# Generate Product model with attributes name (STRING), description (STRING), price (FLOAT), quantity (INTEGER), img (STRING), and inStock (BOOLEAN)
npx sequelize-cli model:generate --name Product --attributes "name:STRING",'description:STRING','price:FLOAT','quantity:INTEGER','img:STRING','inStock:BOOLEAN'

# Generate Order model with attributes amount (FLOAT), quantity (INTEGER), address (JSON), and status (STRING)
npx sequelize-cli model:generate --name Order --attributes "amount:FLOAT",'quantity:INTEGER','address:JSON','status:STRING'

# Create or edit .gitignore file to exclude node_modules directory
echo "/node_modules" >> .gitignore

# Stage changes for README.md
git add README.md

# verifyToken And Authorization
verifyToken middleware checks if a valid token is present in the Authorization header and verifies it using the secret key. If successful, it attaches the decoded user information to the req.user object.

authorization middleware is a higher-order function that takes a requiredRole parameter. It checks if the user's role matches the required role for accessing a particular route.

# 1.User Routes (userRoutes):

Public routes (accessible without token):
POST /register: Register a new user.
POST /login: Log in a user.
POST /logout: Log out a user (requires token).
Protected routes (require token and authorization):
GET /admin/user-credit/statistics: Get user credit statistics for the admin dashboard.
# 2. Review Routes (reviewRoutes):

Protected routes (require token and authorization):
POST /Review/: Create a new review.
GET /Review/: Get all reviews.
GET /Review/:id: Get a review by ID.
PUT /Review/:id: Update a review by ID.
DELETE /Review/:id: Delete a review by ID.
# 3. Product Routes (productRoutes):

Protected routes (require token and authorization):
POST /products: Create a new product (admin only).
GET /products: Get all products.
GET /products/:id: Get a product by ID.
PUT /products/:id: Update a product by ID (admin only).
DELETE /products/:id: Delete a product by ID (admin only).
POST /products/:pid/photo: Upload or fetch product photo (accessible to all users).
# 4. Order Routes (orderRoutes):

Protected routes (require token):
POST /create: Create a new order.
GET /all: Get all orders (user and admin).
GET /:id: Get a single order by ID (user and admin).
PUT /update/:id: Update order status by ID (admin only).
DELETE /delete/:id: Delete order by ID (admin only).
GET /admin/order/count: Get the total count of all orders (admin).
GET /admin/order/monthly-income: Get monthly income based on specified criteria (admin).
GET /admin/order/statistics: Get order statistics for the current month (admin).
# 5. Category Routes (categoryRoutes):

Protected routes (require token and authorization):
POST /categories: Create a new category (admin only).
GET /categories: Get all categories.
GET /categories/:id: Get a single category by ID.
PUT /categories/:id: Update a category by ID (admin only).
DELETE /categories/:id: Delete a category by ID (admin only).
