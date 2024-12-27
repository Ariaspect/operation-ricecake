from flask import Blueprint, jsonify, render_template, url_for, redirect, request
from app.models import db, Product, Option

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


@admin_bp.route('/')
def admin_index():
    print("admin index")
    return render_template('admin/index.html', title="Admin Dashboard")


@admin_bp.route('/product')
def admin_product():
    products = Product.query.all()
    return render_template('admin/product.html', title="Admin Product Menu", product_list=products)


@admin_bp.route('/option')
def admin_option():
    options = Option.query.all()
    return render_template('admin/option.html', title="Admin Option Menu", option_list=options)


@admin_bp.route('/add_product', methods=['GET'])
def add_product_modal():
    return render_template('admin/modal/add_product.html')


@admin_bp.route('/add_product', methods=['POST'])
def add_product():
    product_name = request.form.get('name')
    product_price = request.form.get('price', type=int)
    product_available = 'available' in request.form

    new_product = Product(
        name=product_name, price=product_price, available=product_available)
    db.session.add(new_product)
    db.session.commit()

    return render_template('components/card.html', item=new_product), 201


@admin_bp.route('/edit_product/<int:id>', methods=['GET'])
def edit_product_modal(id: int):
    product = Product.query.get(id)

    if not product:
        return f"Product not found for id: {id}", 404

    return render_template('admin/modal/edit_product.html', product=product)


@admin_bp.route('/edit_product/<int:id>', methods=['POST'])
def edit_product(id: int):
    product = Product.query.get(id)

    if not product:
        return f"Product not found for id: {id}", 404
    product.name = request.form.get('name')
    product.price = request.form.get('price', type=int)
    product.available = 'available' in request.form

    db.session.commit()

    return render_template('components/card.html', item=product), 200


@admin_bp.route('/add_option', methods=['POST'])
def add_option():
    option_name = request.form.get('name')
    option_type = request.form.get('type')

    new_option = Option(
        name=option_name,
        type=option_type
    )
    db.session.add(new_option)
    db.session.commit()

    return redirect(url_for('admin.admin_option'))


@admin_bp.route('/delete_product/<int:product_id>', methods=['POST'])
def delete_product(product_id):
    try:
        # 데이터베이스에서 해당 ID의 항목 삭제
        product = Product.query.get(product_id)
        if product:
            db.session.delete(product)
            db.session.commit()
            return {"message": "success"}, 200
        return {"message": "Product not found"}, 404
    except Exception as e:
        print(f"Error: {e}")
        return {"message": "error"}, 500
