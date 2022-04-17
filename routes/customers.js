var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET Customer page. */
router.get('/', authentication_mdl.is_login, function(req, res, next) {
    req.getConnection(function(err, connection) {
        var query = connection.query('SELECT * FROM barang', function(err, rows) {
            if (err)
                var errornya = ("Error Selecting : %s ", err);
            req.flash('msg_error', errornya);
            res.render('customer/list', {
                title: "Barang",
                data: rows,
                session_store: req.session
            });
        });
        //console.log(query.sql);
    });
});
module.exports = router;
router.post('/add', authentication_mdl.is_login, function(req, res, next) {
    req.assert('name', 'Please fill the name').notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        v_name = req.sanitize('name').escape().trim();
        v_date = req.sanitize('date').escape().trim();
        v_phone = req.sanitize('phone').escape().trim();
        v_jenisbarang = req.sanitize('jenis_barang').escape();
        var customer = {
            name: v_name,
            date: v_date,
            phone: v_phone,
            jenis_barang: v_jenisbarang
        }
        var insert_sql = 'INSERT INTO barang SET ?';
        req.getConnection(function(err, connection) {
            var query = connection.query(insert_sql, customer, function(err, result) {
                if (err) {
                    var errors_detail = ("Error Insert : %s ", err);
                    req.flash('msg_error', errors_detail);
                    res.render('customer/add-customer', {
                        name: req.param('name'),
                        date: req.param('date'),
                        phone: req.param('phone'),
                        jenis_barang: req.param('jenis_barang'),
                    });
                } else {
                    req.flash('msg_info', 'Create barang success');
                    res.redirect('/customers');
                }
            });
        });
    } else {
        console.log(errors);
        errors_detail = "Kayanya ada yang Salah nih <ul>";
        for (i in errors) {
            error = errors[i];
            errors_detail += '<li>' + error.msg + '</li>';
        }
        errors_detail += "</ul>";
        req.flash('msg_error', errors_detail);
        res.render('customer/add-customer', {
            name: req.param('name'),
            phone: req.param('phone')
        });
    }
});
router.get('/add', function(req, res, next) {
    res.render('customer/add-customer', {
        title: 'Add New Barang',
        name: '',
        date: '',
        phone: '',
        jenis_barang: ''
    });
});
router.get('/edit/(:id)', authentication_mdl.is_login, function(req, res, next) {
    req.getConnection(function(err, connection) {
        var query = connection.query('SELECT * FROM barang where id=' + req.params.id, function(err, rows) {
            if (err) {
                var errornya = ("Error Selecting : %s ", err);
                req.flash('msg_error', errors_detail);
                res.redirect('/customers');
            } else {
                if (rows.length <= 0) {
                    req.flash('msg_error', "Barang Ga ketemu :(");
                    res.redirect('/customers');
                } else {
                    console.log(rows);
                    res.render('customer/edit', { title: "Edit ", data: rows[0] });
                }
            }
        });
    });
});
router.put('/edit/(:id)', authentication_mdl.is_login, function(req, res, next) {
    req.assert('name', 'Please fill the name').notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        v_name = req.sanitize('name').escape().trim();
        v_date = req.sanitize('date').escape().trim();
        v_phone = req.sanitize('phone').escape().trim();
        v_jenisbarang = req.sanitize('jenis_barang').escape();
        var customer = {
            name: v_name,
            date: v_date,
            phone: v_phone,
            jenis_barang: v_jenisbarang
        }
        var update_sql = 'update barang SET ? where id = ' + req.params.id;
        req.getConnection(function(err, connection) {
            var query = connection.query(update_sql, customer, function(err, result) {
                if (err) {
                    var errors_detail = ("Error Update : %s ", err);
                    req.flash('msg_error', errors_detail);
                    res.render('customer/edit', {
                        name: req.param('name'),
                        date: req.param('date'),
                        phone: req.param('phone'),
                        jenis_barang: req.param('jenis_barang'),
                    });
                } else {
                    req.flash('msg_info', 'Update barang success');
                    res.redirect('/customers/edit/' + req.params.id);
                }
            });
        });
    } else {
        console.log(errors);
        errors_detail = "Kayanya ada yang Salah nih<ul>";
        for (i in errors) {
            error = errors[i];
            errors_detail += '<li>' + error.msg + '</li>';
        }
        errors_detail += "</ul>";
        req.flash('msg_error', errors_detail);
        res.render('customer/add-customer', {
            name: req.param('name'),
            date: req.param('date')
        });
    }
});
router.delete('/delete/(:id)', authentication_mdl.is_login, function(req, res, next) {
    req.getConnection(function(err, connection) {
        var customer = {
            id: req.params.id,
        }
        var delete_sql = 'delete from barang where ?';
        req.getConnection(function(err, connection) {
            var query = connection.query(delete_sql, customer, function(err, result) {
                if (err) {
                    var errors_detail = ("Error Delete : %s ", err);
                    req.flash('msg_error', errors_detail);
                    res.redirect('/customers');
                } else {
                    req.flash('msg_info', 'Delete barang Success');
                    res.redirect('/customers');
                }
            });
        });
    });
});