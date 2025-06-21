const renderWelcome = (req, res) => {
    res.send('Welcome to Stock Tracker API!');
};

const aboutPage = (req, res) => {
    res.send('Welcome to the About Page');
    // NOTE: res.send and res.json can't be used together
    // You can only send one response
    // res.json({ name: 'Express Server' }); ← this will cause error
};


module.exports = {
    renderWelcome,
    aboutPage
}

