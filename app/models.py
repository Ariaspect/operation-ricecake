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
    product_options = db.relationship(
        "ProductOption", backref="product", lazy=True, cascade="all, delete-orphan"
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
    product_options = db.relationship(
        "ProductOption", backref="option", lazy=True, cascade="all, delete-orphan"
    )


# ProductOption Table


class ProductOption(db.Model):
    __tablename__ = "product_option"
    product_option_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(
        db.Integer, db.ForeignKey("product.product_id"), nullable=False
    )
    option_id = db.Column(db.Integer, db.ForeignKey("option.option_id"), nullable=False)
