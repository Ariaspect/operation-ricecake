from flask import Blueprint, render_template, url_for, redirect, request
from app.models import db, Product

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


@admin_bp.route('/')
def admin_index():
    print("admin index")
    return render_template('admin/index.html', title="Admin Dashboard")


@admin_bp.route('/product')
def admin_product():
    products = Product.query.all()
    return render_template('admin/product.html', title="Admin Menu", product_list=products)


@admin_bp.route('/add_product', methods=['POST'])
def add_product():
    product_name = request.form.get('name')
    product_price = request.form.get('price', type=int)
    product_available = 'available' in request.form

    new_product = Product(
        name=product_name, price=product_price, available=product_available)
    db.session.add(new_product)
    db.session.commit()

    return redirect(url_for('admin.admin_product'))


    # Return a JSON response
    return jsonify({'status': 'success', 'name': product_name, 'price': product_price})
