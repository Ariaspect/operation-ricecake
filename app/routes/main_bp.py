from flask import Blueprint, render_template
from app.models import db, Product

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def index():
    products = Product.query.all()
    return render_template("index.html", title="Main Page", product_list=products)


def group_options_by_type(options, option_type):
    return [option for option in options if option.type == option_type]


def group_options(options):
    option_types = ["slice", "wrap", "addition"]
    return {
        option_type: group_options_by_type(options, option_type)
        for option_type in option_types
    }


@main_bp.route("/order_product/<int:id>", methods=["GET"])
def order_product_modal(id: int):
    product = Product.query.get(id)
    if not product:
        return f"Product not found for id: {id}", 404
    grouped_options = group_options(product.product_options)

    render_template(
        "modal/order_product.html", product=product, grouped_options=grouped_options
    )
