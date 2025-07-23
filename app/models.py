from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# Product Table
class Product(db.Model):
    __tablename__ = "product"
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    available = db.Column(db.Boolean, nullable=False)

    # Relationships
    available_options = db.relationship(
        "Option",
        secondary="product_option",
        back_populates="active_products",
        lazy=True,
    )


# Option Table
class Option(db.Model):
    __tablename__ = "option"
    option_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(
        db.Enum("slice", "wrap", "addition", name="option_type"), nullable=False
    )
    price = db.Column(db.Integer, nullable=False)

    # Relationships
    active_products = db.relationship(
        "Product",
        secondary="product_option",
        back_populates="available_options",
        lazy=True,
    )


# ProductOption Table
class ProductOption(db.Model):
    __tablename__ = "product_option"
    product_option_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(
        db.Integer, db.ForeignKey("product.product_id"), nullable=False
    )
    option_id = db.Column(db.Integer, db.ForeignKey("option.option_id"), nullable=False)


# Order Table
class Order(db.Model):
    __tablename__ = "order"
    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.DateTime, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    payment = db.Column(db.String(255), nullable=False)
    memo = db.Column(db.Text)

    # Relationships
    details = db.relationship("OrderDetail", backref="order", lazy=True)


# OrderDetail Table
class OrderDetail(db.Model):
    __tablename__ = "order_detail"
    order_detail_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.order_id"), nullable=False)
    product_id = db.Column(
        db.Integer, db.ForeignKey("product.product_id"), nullable=False
    )
    quantity = db.Column(db.Integer, nullable=False)

    # Relationships
    options = db.relationship("OrderDetailOption", backref="order_detail", lazy=True)


# OrderDetailOption Table
class OrderDetailOption(db.Model):
    __tablename__ = "order_detail_option"
    order_detail_option_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_detail_id = db.Column(
        db.Integer, db.ForeignKey("order_detail.order_detail_id"), nullable=False
    )
    option_id = db.Column(db.Integer, db.ForeignKey("option.option_id"), nullable=False)
