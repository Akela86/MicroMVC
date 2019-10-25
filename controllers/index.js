module.exports.controller = app => {

    //Route
    app.get('/', (req, res) => {

        obj = {
            title   : 'Titolo Pagina'
        };

        res.render('main', obj);
    });
}
