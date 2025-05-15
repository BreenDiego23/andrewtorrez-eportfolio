exports.travelPage = (req, res) => {
    res.render('travel', {
      title: 'Travel Packages',
      message: 'Explore our exciting travel options 🌍✈️'
    });
  };
  