var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET Customer page. */
router.get('/', authentication_mdl.is_login, function(req, res, next) {
    req.getConnection(function(err, connection) {
        var query = connection.query('SELECT * FROM karyawan', function(err, rows) {
            if (err)
                var errornya = ("Error Selecting : %s ", err);
            req.flash('msg_error', errornya);
            res.render('buah/list', {
                title: "karyawan",
                data: rows,
                session_store: req.session
            });
        });
        //console.log(query.sql);
    });
});
module.exports = router;
router.post('/add', authentication_mdl.is_login, function(req, res, next) {
    req.assert('nama', 'Please fill the name').notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        v_nama = req.sanitize('nama').escape().trim();
        v_umur = req.sanitize('umur').escape().trim();
        v_shift = req.sanitize('shift').escape();
        var customer = {
            nama: v_nama,
            umur: v_umur,
            shift: v_shift,
        }
        var insert_sql = 'INSERT INTO karyawan SET ?';
        req.getConnection(function(err, connection) {
            var query = connection.query(insert_sql, customer, function(err, result) {
                if (err) {
                    var errors_detail = ("Error Insert : %s ", err);
                    req.flash('msg_error', errors_detail);
                    res.render('buah/add-buah', {
                        nama: req.param('nama'),
                        umur: req.param('umur'),
                        shift: req.param('shift'),
                    });
                } else {
                    req.flash('msg_info', 'Create Karyawan success');
                    res.redirect('/buah');
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
        res.render('buah/add-buah', {
            nama: req.param('nama'),
            umur: req.param('umur')
        });
    }
});
router.get('/add', function(req, res, next) {
    res.render('buah/add-buah', {
        title: 'Add New Karyawan',
        nama: '',
        umur: '',
        shift: ''
    });
});
router.get('/edit/(:id)', authentication_mdl.is_login, function(req, res, next) {
    req.getConnection(function(err, connection) {
        var query = connection.query('SELECT * FROM karyawan where id=' + req.params.id, function(err, rows) {
            if (err) {
                var errornya = ("Error Selecting : %s ", err);
                req.flash('msg_error', errors_detail);
                res.redirect('/buah');
            } else {
                if (rows.length <= 0) {
                    req.flash('msg_error', "Karyawan Ga ketemu :(");
                    res.redirect('/buah');
                } else {
                    console.log(rows);
                    res.render('buah/edit', { title: "Edit ", data: rows[0] });
                }
            }
        });
    });
});
router.put('/edit/(:id)', authentication_mdl.is_login, function(req, res, next) {
    req.assert('name', 'Please fill the name').notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        v_nama = req.sanitize('nama').escape().trim();
        v_umur = req.sanitize('umur').escape().trim();
        v_shift = req.sanitize('shift').escape();
        var customer = {
            nama: v_nama,
            umur: v_umur,
            shift: v_shift,
        }
        var update_sql = 'update karyawan SET ? where id = ' + req.params.id;
        req.getConnection(function(err, connection) {
            var query = connection.query(update_sql, customer, function(err, result) {
                if (err) {
                    var errors_detail = ("Error Update : %s ", err);
                    req.flash('msg_error', errors_detail);
                    res.render('buah/edit', {
                        nama: req.param('nama'),
                        umur: req.param('umur'),
                        shift: req.param('shift'),
                    });
                } else {
                    req.flash('msg_info', 'Update Karyawan success');
                    res.redirect('/buah/edit/' + req.params.id);
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
        res.render('buah/add-buah', {
            nama: req.param('nama'),
            umur: req.param('umur')
        });
    }
});
router.delete('/delete/(:id)', authentication_mdl.is_login, function(req, res, next) {
    req.getConnection(function(err, connection) {
        var customer = {
            id: req.params.id,
        }
        var delete_sql = 'delete from karyawan where ?';
        req.getConnection(function(err, connection) {
            var query = connection.query(delete_sql, customer, function(err, result) {
                if (err) {
                    var errors_detail = ("Error Delete : %s ", err);
                    req.flash('msg_error', errors_detail);
                    res.redirect('/buah');
                } else {
                    req.flash('msg_info', 'Delete Karyawan Success');
                    res.redirect('/buah');
                }
            });
        });
    });
});