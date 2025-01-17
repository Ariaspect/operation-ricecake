from flask import Blueprint, jsonify, render_template, url_for, redirect, request
from app.models import db, Product, Option, ProductOption

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


@admin_bp.route("/")
def admin_index():
    return render_template("admin/index.html", title="Admin Dashboard")


@admin_bp.route("/product")
def admin_product():
    products = Product.query.all()
    return render_template(
        "admin/product.html", title="Admin Product Menu", product_list=products
    )


@admin_bp.route("/option")
def admin_option():
    grouped_options = get_options()
    return render_template(
        "admin/option.html", title="Admin Option Menu", option_list=grouped_options
    )


def get_options_by_type(option_type):
    return Option.query.filter_by(type=option_type).all()


def get_options():
    option_types = ["slice", "wrap", "addition"]
    return {
        option_type: get_options_by_type(option_type) for option_type in option_types
    }


@admin_bp.route("/add_product", methods=["GET"])
def add_product_modal():
    grouped_options = get_options()

    return render_template(
        "admin/modal/add_product.html", grouped_options=grouped_options
    )


@admin_bp.route("/add_product", methods=["POST"])
def add_product():
    product_name = request.form.get("name")
    product_price = request.form.get("price", type=int)
    product_available = "available" in request.form
    product_options = request.form.getlist("options")

    new_product = Product(
        name=product_name, price=product_price, available=product_available
    )
    db.session.add(new_product)
    db.session.flush()

    for option_id in product_options:
        product_option = ProductOption(
            product_id=new_product.product_id, option_id=option_id
        )
        db.session.add(product_option)

    db.session.commit()

    return render_template("components/card.html", item=new_product), 201


@admin_bp.route("/edit_product/<int:id>", methods=["GET"])
def edit_product_modal(id: int):
    product = Product.query.get(id)
    if not product:
        return f"Product not found for id: {id}", 404

    grouped_options = get_options()
    selected_options = [option.option_id for option in product.available_options]

    return render_template(
        "admin/modal/edit_product.html",
        product=product,
        grouped_options=grouped_options,
        selected_options=selected_options,
    )


@admin_bp.route("/edit_product/<int:id>", methods=["POST"])
def edit_product(id: int):
    product = Product.query.get(id)

    if not product:
        return f"Product not found for id: {id}", 404
    product.name = request.form.get("name")
    product.price = request.form.get("price", type=int)
    product.available = "available" in request.form

    old_options = {option.option_id for option in product.available_options}
    new_options = set(map(int, request.form.getlist("options")))

    for option_id in old_options - new_options:
        target = next(
            (
                option
                for option in product.available_options
                if option.option_id == option_id
            ),
            None,
        )
        if target:
            db.session.delete(target)
    for option_id in new_options - old_options:
        product_option = ProductOption(
            product_id=product.product_id, option_id=option_id
        )
        db.session.add(product_option)

    db.session.commit()

    return render_template("components/card.html", item=product), 200


@admin_bp.route("/add_option", methods=["GET"])
def add_option_modal():
    return render_template("admin/modal/add_option.html")


@admin_bp.route("/add_option", methods=["POST"])
def add_option():
    option_name = request.form.get("name")
    option_type = request.form.get("type")
    option_price = request.form.get("price", type=int)

    new_option = Option(name=option_name, type=option_type, price=option_price)
    db.session.add(new_option)
    db.session.commit()

    return render_template("components/option.html", item=new_option), 201


@admin_bp.route("/delete_product/<int:id>", methods=["POST"])
def delete_product(id):
    try:
        # 데이터베이스에서 해당 ID의 항목 삭제
        product = Product.query.get(id)
        if product:
            db.session.delete(product)
            db.session.commit()
            return {"message": "success"}, 200
        return {"message": "Product not found"}, 404
    except Exception as e:
        print(f"Error: {e}")
        return {"message": "error"}, 500


@admin_bp.route("/delete_option/<int:id>", methods=["POST"])
def delete_option(id):
    try:
        # 데이터베이스에서 해당 ID의 항목 삭제
        option = Option.query.get(id)
        if option:
            db.session.delete(option)
            db.session.commit()
            return {"message": "success"}, 200
        return {"message": "Option not found"}, 404
    except Exception as e:
        print(f"Error: {e}")
        return {"message": "error"}, 500
