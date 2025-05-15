exports.index = (req, res) => {
    res.render('index', {
      title: 'Welcome to Travlr!',
      message: 'This site is now using the MVC structure with Handlebars 🧡'
    });
  };
  